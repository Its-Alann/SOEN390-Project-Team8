/* eslint-disable react/no-array-index-key */
import * as React from "react";
import PropTypes from "prop-types";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import MessageListItem from "./ConversationListItem";

const MessageList = (props) => {
  // Very mysterious
  // Without this hello, state won't update?????
  // How??
  const hello = "hello";
  return (
    <List>
      {props.messages.map((message, i) => (
        <ListItem key={i}>
          <MessageListItem
            timestamp={message.timestamp.toDate()}
            content={message.content}
            sender={message.sender}
          />
        </ListItem>
      ))}
    </List>
  );
};

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.any),
};
export default MessageList;