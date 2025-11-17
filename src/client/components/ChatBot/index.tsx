import SendIcon from "@mui/icons-material/Send";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { Box, Avatar, Paper, TextField, Button, Stack, Typography } from "@mui/material";

import aiAssistant from "~/assets/images/ai-assistant.png";
import logoImg from "~/assets/images/Logo/logo-black.png";
import { Message } from "./Message";
import axiosClient from "~/client/hooks/useFetch";
import { AuthContext } from "~/client/context/AuthContext";
import type Conversation from "~/client/types/conversation";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Conversation[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const { customer } = useContext(AuthContext);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const avatarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const raf = requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
    return () => cancelAnimationFrame(raf);
  }, [messages, open]);

  useEffect(() => {
    if (customer) {
      async function fetchConversationHistory() {
        setLoading(true);
        try {
          const res = await axiosClient.get("/chat/history");
          if (res.data.code == 1000) {
            const conversation: Conversation[] = res.data.result;
            if (conversation.length === 0) {
              setMessages([{ role: "ASSISTANT", message: "Xin chào! Bạn cần hỗ trợ gì?" }]);
            } else {
              setMessages(conversation.slice().reverse());
            }
          }
        } catch (error: any) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              role: "ASSISTANT",
              message: "Có lỗi xãy ra vui lòng thử lại!",
            },
          ]);
        } finally {
          setLoading(false);
        }
      }
      fetchConversationHistory();
    } else {
      try {
        const conversationHistory: Conversation[] = JSON.parse(
          localStorage.getItem("conversationHistory") || "[]"
        );
        if (conversationHistory.length === 0) {
          setMessages([{ role: "ASSISTANT", message: "Xin chào! Bạn cần hỗ trợ gì?" }]);
        } else {
          setMessages(conversationHistory);
        }
      } catch (error) {
        setMessages([{ role: "ASSISTANT", message: "Xin chào! Bạn cần hỗ trợ gì?" }]);
      }
    }
  }, [customer]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!open) return;
      const target = e.target as Node | null;
      if (
        target &&
        chatRef.current &&
        !chatRef.current.contains(target) &&
        avatarRef.current &&
        !avatarRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function handleSendMessage() {
    if (!inputValue.trim()) return;
    let updatedMessages: Conversation[] = [...messages, { role: "CUSTOMER", message: inputValue }];
    setMessages(updatedMessages);
    setInputValue("");
    setLoading(true);
    try {
      const res = await axiosClient.post("/chat", {
        role: "CUSTOMER",
        message: inputValue,
        conversationHistory: updatedMessages,
      });
      if (res.data.code == 1000) {
        const answer = res.data.result.answer;
        updatedMessages = [...updatedMessages, { role: "ASSISTANT", message: answer }];
        setMessages(updatedMessages);
      }
    } catch (error: any) {
      updatedMessages = [
        ...updatedMessages,
        { role: "ASSISTANT", message: "Có lỗi xãy ra vui lòng thử lại!" },
      ];
      setMessages(updatedMessages);
    } finally {
      setLoading(false);
      localStorage.setItem("conversationHistory", JSON.stringify(updatedMessages.slice(-15)));
    }
  }

  return (
    <Fragment>
      {open && (
        <Paper
          elevation={6}
          ref={chatRef}
          sx={{
            position: "fixed",
            bottom: 120,
            right: 20,
            width: 350,
            height: 500,
            p: 2,
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            bgcolor: "background.default",
            zIndex: 9999,
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          }}
        >
          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}
          >
            <Typography variant="h5" fontWeight={600}>
              Stylist AI Tư Vấn
            </Typography>
            <Box component="img" src={logoImg} alt="Logo" sx={{ height: 20 }} />
          </Box>

          <Stack
            ref={messagesContainerRef}
            spacing={1}
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              border: "1px solid #eee",
              p: 1,
              borderRadius: 2,
            }}
          >
            {messages.map((msg, index) => (
              <Message
                key={index}
                messageText={msg.message}
                isCustomerMessage={msg.role === "CUSTOMER"}
              />
            ))}
            {loading && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1 }}>
                <Avatar src={aiAssistant} sx={{ width: 30, height: 30 }} />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    minWidth: 40,
                    justifyContent: "center",
                    height: 24,
                    bgcolor: "primary.main",
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      animation: "bounce 1.4s infinite both",
                      animationDelay: "0s",
                      mr: 0.5,
                      bgcolor: "text.secondary",
                    }}
                  />
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      animation: "bounce 1.4s infinite both",
                      animationDelay: "0.2s",
                      mr: 0.5,
                      bgcolor: "text.secondary",
                    }}
                  />
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      animation: "bounce 1.4s infinite both",
                      animationDelay: "0.4s",
                      bgcolor: "text.secondary",
                    }}
                  />
                </Box>
              </Box>
            )}
          </Stack>

          <Box sx={{ display: "flex", mt: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Nhập tin nhắn..."
              value={inputValue}
              inputRef={inputRef}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
            />
            <Button
              variant="contained"
              sx={{ ml: 1, fontSize: "1.4rem" }}
              endIcon={<SendIcon />}
              onClick={handleSendMessage}
              disabled={loading}
            >
              Gửi
            </Button>
          </Box>
        </Paper>
      )}

      <Avatar
        ref={avatarRef}
        src={aiAssistant}
        sx={{
          width: 45,
          height: 45,
          position: "fixed",
          bottom: 70,
          right: 15,
          cursor: "pointer",
          zIndex: 10000,
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        }}
        onClick={() => setOpen(true)}
      />
    </Fragment>
  );
}
