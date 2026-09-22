import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Copy,
    Check,
    RefreshCw,
    Trash2,
    LogOut,
    Plus,
    Send,
    Sparkles,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import API from "../api";


function CodeBlock({ children }) {
    const [copied, setCopied] = useState(false);

    const child = Array.isArray(children)
        ? children[0]
        : children;

    const className =
        child?.props?.className || "";

    const code = String(
        child?.props?.children || ""
    ).replace(/\n$/, "");

    const language =
        className
            .replace("language-", "")
            .trim() || "code";

    const copyCode = async () => {
        try {
            await navigator.clipboard.writeText(code);

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.error("Copy failed:", error);
        }
    };

    return (
        <div className="code-block">
            <div className="code-header">
                <span>{language}</span>

                <button
                    type="button"
                    className="copy-button"
                    onClick={copyCode}
                >
                    {copied ? (
                        <>
                            <Check size={14} />
                            Copied
                        </>
                    ) : (
                        <>
                            <Copy size={14} />
                            Copy
                        </>
                    )}
                </button>
            </div>

            <pre>
                <code className={className}>
                    {code}
                </code>
            </pre>
        </div>
    );
}


function ChatWindow() {
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const [conversations, setConversations] = useState([]);
    const [conversationId, setConversationId] =
        useState(null);

    const [loadingChats, setLoadingChats] =
        useState(true);

    const [regenerating, setRegenerating] =
        useState(false);

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const textareaRef = useRef(null);
    const messagesEndRef = useRef(null);

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );


    /* ================================
       AUTH + INITIAL LOAD
    ================================= */

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        loadConversations();
    }, [navigate]);


    /* ================================
       AUTO SCROLL
    ================================= */

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, loading]);


    /* ================================
       TEXTAREA AUTO RESIZE
    ================================= */

    useEffect(() => {
        const textarea = textareaRef.current;

        if (!textarea) return;

        textarea.style.height = "auto";

        textarea.style.height =
            `${Math.min(
                textarea.scrollHeight,
                180
            )}px`;
    }, [input]);


    /* ================================
       LOAD CONVERSATIONS
    ================================= */

    const loadConversations = async () => {
        try {
            setLoadingChats(true);

            const response =
                await API.get("/chat");

            setConversations(
                response.data.conversations || []
            );
        } catch (error) {
            console.error(
                "Failed to load conversations:",
                error
            );
        } finally {
            setLoadingChats(false);
        }
    };


    /* ================================
       LOAD SINGLE CONVERSATION
    ================================= */

    const loadConversation = async (id) => {
        if (loading) return;

        try {
            setLoading(true);

            const response =
                await API.get(`/chat/${id}`);

            const conversation =
                response.data.conversation;

            setConversationId(
                conversation._id
            );

            setMessages(
                conversation.messages || []
            );

            setSidebarOpen(false);
        } catch (error) {
            console.error(
                "Failed to load conversation:",
                error
            );
        } finally {
            setLoading(false);
        }
    };


    /* ================================
       NEW CHAT
    ================================= */

    const createNewChat = () => {
        if (loading) return;

        setConversationId(null);
        setMessages([]);
        setInput("");
        setSidebarOpen(false);

        setTimeout(() => {
            textareaRef.current?.focus();
        }, 50);
    };


    /* ================================
       SEND MESSAGE
    ================================= */

    const sendMessage = async () => {
        const message = input.trim();

        if (!message || loading) {
            return;
        }

        const userMessage = {
            role: "user",
            content: message,
        };

        setMessages((prev) => [
            ...prev,
            userMessage,
        ]);

        setInput("");
        setLoading(true);

        try {
            const response =
                await API.post("/chat", {
                    conversationId,
                    message,
                });

            const assistantMessage = {
                role: "assistant",
                content:
                    response.data.message ||
                    "I didn't receive a response.",
            };

            setMessages((prev) => [
                ...prev,
                assistantMessage,
            ]);

            if (response.data.conversationId) {
                setConversationId(
                    response.data.conversationId
                );
            }

            await loadConversations();
        } catch (error) {
            console.error(
                "Chat error:",
                error
            );

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        error.response?.data
                            ?.message ||
                        "Something went wrong while contacting the server.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };


    /* ================================
       REGENERATE
    ================================= */

    const regenerateResponse = async () => {
        if (!conversationId || loading) {
            return;
        }

        try {
            setRegenerating(true);

            const response =
                await API.post(
                    `/chat/${conversationId}/regenerate`
                );

            setMessages((prev) => {
                const updated = [...prev];

                if (
                    updated.length &&
                    updated[
                        updated.length - 1
                    ].role === "assistant"
                ) {
                    updated.pop();
                }

                updated.push({
                    role: "assistant",
                    content:
                        response.data.message,
                });

                return updated;
            });

            await loadConversations();
        } catch (error) {
            console.error(
                "Regenerate error:",
                error
            );
        } finally {
            setRegenerating(false);
        }
    };


    /* ================================
       DELETE CONVERSATION
    ================================= */

    const deleteConversation = async (
        event,
        id
    ) => {
        event.stopPropagation();

        try {
            await API.delete(`/chat/${id}`);

            setConversations((prev) =>
                prev.filter(
                    (conversation) =>
                        conversation._id !== id
                )
            );

            if (conversationId === id) {
                createNewChat();
            }
        } catch (error) {
            console.error(
                "Delete error:",
                error
            );
        }
    };


    /* ================================
       LOGOUT
    ================================= */

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };


    /* ================================
       KEYBOARD
    ================================= */

    const handleKeyDown = (event) => {
        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {
            event.preventDefault();
            sendMessage();
        }
    };


    /* ================================
       TITLE
    ================================= */

    const getConversationTitle = (
        conversation
    ) => {
        if (
            conversation.title &&
            conversation.title !== "New Chat"
        ) {
            return conversation.title;
        }

        return "New conversation";
    };


    return (
        <div className="chat-app">

            {/* ============================
                SIDEBAR
            ============================= */}

            <aside
                className={`sidebar ${
                    sidebarOpen
                        ? "sidebar-open"
                        : ""
                }`}
            >
                <div className="sidebar-top">

                    <div className="brand">
                        <div className="brand-icon">
                            <Sparkles size={18} />
                        </div>

                        <span>
                            DevGPT
                        </span>
                    </div>


                    <button
                        className="new-chat"
                        onClick={createNewChat}
                    >
                        <Plus size={18} />

                        <span>
                            New chat
                        </span>
                    </button>


                    <div className="conversation-list">

                        {loadingChats ? (
                            <div className="sidebar-loading">
                                Loading chats...
                            </div>
                        ) : conversations.length ===
                          0 ? (
                            <div className="sidebar-empty">
                                Your conversations
                                will appear here
                            </div>
                        ) : (
                            conversations.map(
                                (conversation) => (
                                    <div
                                        key={
                                            conversation._id
                                        }
                                        className={`conversation-item ${
                                            conversationId ===
                                            conversation._id
                                                ? "active-conversation"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            loadConversation(
                                                conversation._id
                                            )
                                        }
                                    >
                                        <span className="conversation-title">
                                            {getConversationTitle(
                                                conversation
                                            )}
                                        </span>

                                        <button
                                            type="button"
                                            className="delete-chat"
                                            onClick={(
                                                event
                                            ) =>
                                                deleteConversation(
                                                    event,
                                                    conversation._id
                                                )
                                            }
                                            title="Delete conversation"
                                        >
                                            <Trash2
                                                size={14}
                                            />
                                        </button>
                                    </div>
                                )
                            )
                        )}

                    </div>
                </div>


                <div className="sidebar-bottom">

                    <div className="user-info">
                        <div className="avatar">
                            {user?.name
                                ? user.name
                                      .charAt(0)
                                      .toUpperCase()
                                : "U"}
                        </div>

                        <div className="user-name">
                            {user?.name || "User"}
                        </div>
                    </div>


                    <button
                        className="logout-button"
                        onClick={logout}
                    >
                        <LogOut size={15} />

                        <span>
                            Log out
                        </span>
                    </button>

                </div>
            </aside>


            {/* MOBILE OVERLAY */}

            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() =>
                        setSidebarOpen(false)
                    }
                />
            )}


            {/* ============================
                MAIN
            ============================= */}

            <main className="chat-main">

                <header className="chat-header">

                    <button
                        className="mobile-menu-button"
                        onClick={() =>
                            setSidebarOpen(true)
                        }
                        aria-label="Open sidebar"
                    >
                        ☰
                    </button>

                    <div>
                        <h2>
                            DevGPT
                        </h2>

                        <span>
                            <span className="online-dot">
                                ●
                            </span>{" "}
                            Gemini AI
                        </span>
                    </div>

                </header>


                {/* ============================
                    MESSAGES
                ============================= */}

                <div className="messages-container">

                    <div className="messages">

                        {messages.length === 0 && (
                            <div className="welcome-screen">

                                <div className="welcome-icon">
                                    <Sparkles
                                        size={25}
                                    />
                                </div>

                                <h1>
                                    How can I help
                                    you today?
                                </h1>

                                <p>
                                    Ask me about
                                    programming,
                                    debugging,
                                    DSA, backend
                                    development,
                                    databases, or
                                    anything you're
                                    building.
                                </p>

                                <div className="suggestion-grid">

                                    <button
                                        onClick={() =>
                                            setInput(
                                                "Explain binary search in Java"
                                            )
                                        }
                                    >
                                        Explain binary
                                        search
                                    </button>

                                    <button
                                        onClick={() =>
                                            setInput(
                                                "Help me debug my Node.js API"
                                            )
                                        }
                                    >
                                        Debug a Node.js
                                        API
                                    </button>

                                    <button
                                        onClick={() =>
                                            setInput(
                                                "Explain JWT authentication"
                                            )
                                        }
                                    >
                                        Explain JWT
                                        authentication
                                    </button>

                                    <button
                                        onClick={() =>
                                            setInput(
                                                "Give me a DSA problem to practice"
                                            )
                                        }
                                    >
                                        Practice DSA
                                    </button>

                                </div>

                            </div>
                        )}


                        {messages.map(
                            (message, index) => (
                                <div
                                    key={index}
                                    className={`message-row ${
                                        message.role ===
                                        "user"
                                            ? "user-row"
                                            : "assistant-row"
                                    }`}
                                >

                                    {message.role ===
                                        "assistant" && (
                                        <div className="message-avatar">
                                            <Sparkles
                                                size={16}
                                            />
                                        </div>
                                    )}


                                    <div
                                        className={`message ${
                                            message.role ===
                                            "user"
                                                ? "user-message"
                                                : "assistant-message"
                                        }`}
                                    >

                                        {message.role ===
                                        "assistant" ? (
                                            <ReactMarkdown
                                                remarkPlugins={[
                                                    remarkGfm,
                                                ]}
                                                components={{
                                                    pre: CodeBlock,
                                                }}
                                            >
                                                {
                                                    message.content
                                                }
                                            </ReactMarkdown>
                                        ) : (
                                            message.content
                                        )}

                                    </div>


                                    {message.role ===
                                        "user" && (
                                        <div className="message-avatar user-avatar">
                                            {user?.name
                                                ? user.name
                                                      .charAt(
                                                          0
                                                      )
                                                      .toUpperCase()
                                                : "U"}
                                        </div>
                                    )}

                                </div>
                            )
                        )}


                        {loading && (
                            <div className="message-row assistant-row">

                                <div className="message-avatar">
                                    <Sparkles
                                        size={16}
                                    />
                                </div>

                                <div className="assistant-message typing">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>

                            </div>
                        )}


                        <div ref={messagesEndRef} />

                    </div>

                </div>


                {/* ============================
                    INPUT
                ============================= */}

                <div className="input-area">

                    {conversationId &&
                        messages.length > 1 &&
                        messages[
                            messages.length - 1
                        ].role === "assistant" && (

                            <div className="regenerate-wrapper">

                                <button
                                    className="regenerate-button"
                                    onClick={
                                        regenerateResponse
                                    }
                                    disabled={
                                        loading ||
                                        regenerating
                                    }
                                >
                                    <RefreshCw
                                        size={14}
                                    />

                                    {regenerating
                                        ? "Regenerating..."
                                        : "Regenerate response"}
                                </button>

                            </div>
                        )}


                    <form
                        className="chat-input-wrapper"
                        onSubmit={(event) => {
                            event.preventDefault();
                            sendMessage();
                        }}
                    >
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(event) =>
                                setInput(
                                    event.target.value
                                )
                            }
                            onKeyDown={handleKeyDown}
                            placeholder="Message DevGPT..."
                            rows={1}
                            disabled={loading}
                        />

                        <button
                            type="submit"
                            className="send-button"
                            disabled={
                                !input.trim() ||
                                loading
                            }
                        >
                            <Send size={17} />
                        </button>
                    </form>


                    <p className="disclaimer">
                        DevGPT can make mistakes.
                        Check important
                        information.
                    </p>

                </div>

            </main>
        </div>
    );
}

export default ChatWindow;