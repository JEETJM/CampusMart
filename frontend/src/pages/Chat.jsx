import { useEffect, useState } from "react";
import { ArrowLeft, MessageCircle, Send, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

const Chat = () => {
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("campusmart_token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    fetchConversations();
  }, [navigate]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/chat/conversations");

      const data = response.data?.conversations || [];

      setConversations(data);

      if (data.length > 0) {
        selectConversation(data[0]);
      }
    } catch (err) {
      console.error("Conversation Error:", err);

      setError(err.response?.data?.message || "Unable to load conversations.");
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = async (conversation) => {
    setSelectedConversation(conversation);

    try {
      setMessagesLoading(true);

      const response = await api.get(
        `/chat/conversations/${conversation._id}/messages`,
      );

      setMessages(response.data?.messages || []);
    } catch (err) {
      console.error("Messages Error:", err);

      setError(err.response?.data?.message || "Unable to load messages.");
    } finally {
      setMessagesLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim() || !selectedConversation) {
      return;
    }

    try {
      setSending(true);

      const response = await api.post(
        `/chat/conversations/${selectedConversation._id}/messages`,
        {
          text: text.trim(),
        },
      );

      const newMessage = response.data?.message;

      if (newMessage) {
        setMessages((current) => [...current, newMessage]);
      }

      setConversations((current) =>
        current.map((conversation) =>
          conversation._id === selectedConversation._id ?
            {
              ...conversation,
              lastMessage: text.trim(),
              lastMessageAt: new Date(),
            }
          : conversation,
        ),
      );

      setText("");
    } catch (err) {
      console.error("Send Message Error:", err);

      setError(err.response?.data?.message || "Unable to send message.");
    } finally {
      setSending(false);
    }
  };

  const getOtherParticipant = (conversation) => {
    const currentUser = JSON.parse(
      localStorage.getItem("campusmart_user") || "{}",
    );

    return conversation.participants?.find(
      (participant) => participant._id !== currentUser._id,
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="animate-pulse rounded-2xl bg-white p-6">
            <div className="h-8 w-48 rounded bg-slate-200" />
            <div className="mt-6 h-[500px] rounded-xl bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={17} />
            Back to Profile
          </Link>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
              <MessageCircle size={21} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">Messages</h1>

              <p className="text-sm text-slate-500">
                Chat with buyers and sellers on CampusMart.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid h-[650px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[340px_1fr]">
          {/* Conversations */}
          <aside className="overflow-y-auto border-r border-slate-200">
            <div className="border-b border-slate-200 p-5">
              <h2 className="font-bold text-slate-900">Conversations</h2>

              <p className="mt-1 text-xs text-slate-500">
                {conversations.length} conversation
                {conversations.length !== 1 ? "s" : ""}
              </p>
            </div>

            {conversations.length === 0 ?
              <div className="px-5 py-12 text-center">
                <MessageCircle size={30} className="mx-auto text-slate-300" />

                <p className="mt-4 text-sm font-semibold text-slate-700">
                  No conversations yet
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Start a chat from a product page.
                </p>
              </div>
            : <div>
                {conversations.map((conversation) => {
                  const other = getOtherParticipant(conversation);

                  const active = selectedConversation?._id === conversation._id;

                  return (
                    <button
                      key={conversation._id}
                      onClick={() => selectConversation(conversation)}
                      className={`w-full border-b border-slate-100 p-4 text-left transition ${
                        active ? "bg-slate-50" : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                          {(other?.name || "U").charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {other?.name || "Student"}
                          </p>

                          <p className="mt-1 truncate text-xs text-slate-500">
                            {conversation.product?.title ||
                              "Product conversation"}
                          </p>

                          <p className="mt-1 truncate text-xs text-slate-400">
                            {conversation.lastMessage || "No messages yet"}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            }
          </aside>

          {/* Chat */}
          <section className="flex min-w-0 flex-col">
            {!selectedConversation ?
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <MessageCircle size={42} className="text-slate-300" />

                <h2 className="mt-4 text-lg font-bold text-slate-800">
                  Select a conversation
                </h2>

                <p className="mt-1 max-w-sm text-sm text-slate-500">
                  Select a conversation from the left to start messaging.
                </p>
              </div>
            : <>
                {/* Chat Header */}
                <div className="flex items-center gap-3 border-b border-slate-200 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white">
                    <User size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">
                      {getOtherParticipant(selectedConversation)?.name ||
                        "Student"}
                    </p>

                    <p className="truncate text-xs text-slate-500">
                      {selectedConversation.product?.title || "Product"}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-5">
                  {messagesLoading ?
                    <div className="flex h-full items-center justify-center">
                      <p className="text-sm text-slate-500">
                        Loading messages...
                      </p>
                    </div>
                  : messages.length === 0 ?
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <MessageCircle size={35} className="text-slate-300" />

                      <p className="mt-3 text-sm font-semibold text-slate-700">
                        Start the conversation
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Ask about the product, price, pickup or availability.
                      </p>
                    </div>
                  : messages.map((message) => {
                      const currentUser = JSON.parse(
                        localStorage.getItem("campusmart_user") || "{}",
                      );

                      const mine = message.sender?._id === currentUser._id;

                      return (
                        <div
                          key={message._id}
                          className={`flex ${
                            mine ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                              mine ?
                                "bg-slate-900 text-white"
                              : "bg-white text-slate-800 shadow-sm"
                            }`}
                          >
                            <p className="text-sm leading-6">{message.text}</p>

                            <p
                              className={`mt-1 text-[10px] ${
                                mine ? "text-slate-300" : "text-slate-400"
                              }`}
                            >
                              {new Date(message.createdAt).toLocaleTimeString(
                                "en-IN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  }
                </div>

                {/* Input */}
                <form
                  onSubmit={sendMessage}
                  className="flex gap-3 border-t border-slate-200 bg-white p-4"
                >
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write a message..."
                    maxLength={2000}
                    className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  />

                  <button
                    type="submit"
                    disabled={sending || !text.trim()}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </>
            }
          </section>
        </div>
      </main>
    </div>
  );
};

export default Chat;
