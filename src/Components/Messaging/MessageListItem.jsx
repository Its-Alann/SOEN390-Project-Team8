import * as React from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Unstable_Grid2";
import { Box, Stack, ListItemText, ListItem } from "@mui/material";

const MessageListItem = ({
  content,
  attachment,
  sender,
  timestamp,
  alignment,
  openAttachment,
  index,
}) => {
  const antinos = "🖖";

  return (
    <Stack
      className="message-stack"
      container
      alignItems={alignment === "right" ? "flex-end" : "flex-start"}
      sx={{ maxWidth: "100%" }}
    >
      <Box sx={{ px: "12px", maxWidth: "100%" }}>
        <ListItemText secondary={sender} align={alignment} />
      </Box>

      <Box
        sx={{
          bgcolor: alignment === "right" ? "secondary.main" : "gray.main",
          width: "fit-content",
          maxWidth: "100%",
          p: 1.5,
          borderRadius: 3,
        }}
      >
        {attachment ? (
          <ListItem disablePadding>
            <ListItemText
              sx={{
                display: "inline-block",
                "&:hover": {
                  color: "blue",
                  textDecoration: "underline",
                  cursor: "pointer",
                },
              }}
              primary={`🔗${attachment}`}
              align={alignment}
              onClick={() => openAttachment(attachment)}
              data-testid="attachment"
            />
          </ListItem>
        ) : (
          <ListItemText
            sx={{ display: "inline-block" }}
            primary={content}
            align={alignment}
          />
        )}
      </Box>
      <ListItemText
        style={{ marginLeft: "12px", marginRight: "12px" }}
        align={alignment}
        secondary={timestamp.toLocaleString()}
      />
    </Stack>
  );
};

MessageListItem.propTypes = {
  content: PropTypes.string,
  attachment: PropTypes.string,
  timestamp: PropTypes.instanceOf(Date),
  sender: PropTypes.string,
  alignment: PropTypes.string,
  openAttachment: PropTypes.func,
  index: PropTypes.number,
};
export default MessageListItem;
