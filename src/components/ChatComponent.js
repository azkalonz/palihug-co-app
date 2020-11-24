import { Avatar, Box, Button, TextField, Typography } from "@material-ui/core";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import UserContext from "../context/UserContext";
import Chat from "../models/Chat";
import moment from "moment";
import { render } from "@testing-library/react";

let text_message = "";

function ChatComponent(props) {
  const { order_id, consumer_user_id, provider_user_id } = props;
  const [participants, setParticipants] = useState(null);
  const [messages, setMessages] = useState([]);
  const chatRef = useRef();
  const { userContext } = useContext(UserContext);
  const [sending, setSending] = useState();
  const receiver_id =
    consumer_user_id !== userContext.user_id
      ? consumer_user_id
      : provider_user_id;
  useEffect(() => {
    Chat.subscribe(order_id);
    (async () => {
      let chat = await Chat.get(order_id);
      const { participants, messages } = chat;
      if (messages) setMessages(messages);
      if (participants) setParticipants(participants);
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    })();
    return () => {
      Chat.unsubscribe(order_id);
    };
  }, []);
  const RenderMessage = useCallback(({ message, user, position, meta }) => {
    const renderer = {
      text: (
        <Box
          key={message.chat_id}
          onClick={(e) => {
            e.currentTarget.toggleAttribute("data-show");
          }}
          className="message-container"
        >
          <Box width="100%" textAlign="center" className="chat-details">
            <Typography>{moment(message.created_at).format("llll")}</Typography>
          </Box>
          <Box display="flex" className={"chat-entry " + position}>
            {position === "left" && <Avatar alt={user.user_fname[0]} src="/" />}
            <TextMessage {...message} position={position} />
            {position === "right" && (
              <Avatar alt={user.user_fname[0]} src="/" />
            )}
          </Box>
        </Box>
      ),
    };

    return renderer[meta.type];
  }, []);
  const sendMessage = useCallback(async () => {
    if (participants?.length) {
      let sender_id = userContext.user_id;
      let message = {
        sender_id,
        receiver_id,
        chat_meta: JSON.stringify({
          message: text_message,
          type: "text",
        }),
      };
      setSending(message);
      await Chat.send(order_id, message);
    }
  }, [participants, userContext]);
  useEffect(() => {
    Chat.listen((chat_meta) => {
      setTimeout(() => {
        setSending(null);
      }, 4000);
      setMessages([...messages, chat_meta]);
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    });
  }, [messages]);
  return (
    <React.Fragment>
      <div className="chat-content" ref={chatRef}>
        {participants &&
          messages.map((message) => {
            const meta = JSON.parse(message.chat_meta);
            const user = participants.find(
              (q) => q.user_id === message.sender_id
            );
            const position =
              message.sender_id === userContext.user_id ? "right" : "left";
            return RenderMessage({ meta, message, user, position });
          })}
        {sending && <Preview {...sending} user={userContext} />}
      </div>
      <div className="chat-controls">
        <TextField onChange={(e) => (text_message = e.target.value)} />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </React.Fragment>
  );
}
function Preview(props) {
  const { chat_meta, position = "right", user } = props;
  const meta = JSON.parse(chat_meta);
  return (
    <Box className="message-container">
      f
      <Box display="flex" className={"chat-entry " + position}>
        {position === "left" && <Avatar alt={user.user_fname[0]} src="/" />}
        <TextMessage {...props} position={position} />
        {position === "right" && <Avatar alt={user.user_fname[0]} src="/" />}
      </Box>
    </Box>
  );
}
function TextMessage(props) {
  const { chat_meta } = props;
  const meta = JSON.parse(chat_meta || {});
  return (
    <React.Fragment>
      <div className={"text-message " + props.position}>
        <Box className="message">
          <Typography>{meta.message}</Typography>
        </Box>
      </div>
    </React.Fragment>
  );
}
export default ChatComponent;
