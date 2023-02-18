/* eslint-disable react/no-array-index-key */
import * as React from "react";
import PropTypes from "prop-types";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import MessageListItem from "./MessageListItem";
import { auth } from "../../Firebase/firebase";

const MessageList = ({ messages }) => {
  // Very mysterious
  // Without this hello, state won't update?????
  // How??
  const hello = "hello";
  return (
    <List>
      {messages.map((message, i) => {
        const alignment =
          message.sender === auth.currentUser.email ? "right" : "left";
        console.log(message.sender, alignment);
        return (
          <ListItem key={i} style={{ justifyContent: alignment }}>
            <MessageListItem
              timestamp={message.timestamp.toDate()}
              content={message.content}
              sender={message.sender}
              alignment={alignment}
            />
          </ListItem>
        );
      })}
    </List>
  );
};

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.any),
};
export default MessageList;
