
export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    ANALYZE_RESUME: `${API_BASE_URL}/Ats/resume/AtsAnalysis`,
    ANALYZE_JOB_FIT: `${API_BASE_URL}/Ats/resume/job-match-Analysis`,
    GENERATE_MCQS: `${API_BASE_URL}/Ats/resume/mcq-test`
};

const getErrorMessage = (payload, fallback) => {

    const handleAuthenticationFailure = (status) => {
        if (status !== 401 && status !== 403) return;

        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");

        if (window.location.pathname !== "/login") {
            window.location.replace("/login");
        }
    };
    if (!payload) return fallback;

    try {
        const parsed = typeof payload === "string" ? JSON.parse(payload) : payload;
        const errorBody = parsed.body || parsed.errorResponse || parsed;
        return errorBody.message || errorBody.detail || errorBody.error || fallback;
    } catch {
        return typeof payload === "string" && payload.trim() ? payload.trim() : fallback;
    }
};

export async function streamMultipart(endpoint, fields, onEvent, options = {}) {
    const { requiredEvents = [] } = options;
    const formData = new FormData();
    const receivedEvents = new Set();

    Object.entries(fields).forEach(([name, value]) => {
        formData.append(name, value);
    });

    const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        body: formData
    });

    if (!response.ok) {
        handleAuthenticationFailure(response.status);
        const message = await response.text();
        throw new Error(getErrorMessage(message, `Request failed with status ${response.status}`));
    }

    if (!response.body) {
        throw new Error("The server did not return a streaming response.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    const processEvent = (rawEvent) => {
        let eventName = "message";
        const dataLines = [];

        rawEvent.split(/\r?\n/).forEach((line) => {
            if (line.startsWith("event:")) {
                eventName = line.slice(6).trim();
            } else if (line.startsWith("data:")) {
                dataLines.push(line.slice(5).trimStart());
            }
        });

        if (!dataLines.length) {
            return;
        }

        const dataText = dataLines.join("\n");
        let data;

    while (true) {
        const { value, done } = await reader.read();
        buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
        }
        const events = buffer.split(/\r?\n\r?\n/);
        buffer = events.pop() || "";
            throw new Error(getErrorMessage(data, "Resume analysis failed."));
        events.filter(Boolean).forEach(processEvent);

        if (done) {
            if (buffer.trim()) {
                processEvent(buffer);
        }
            break;

    }
        receivedEvents.add(eventName);
    const missingEvents = requiredEvents.filter((eventName) => !receivedEvents.has(eventName));
    if (missingEvents.length > 0) {
        throw new Error(`Incomplete analysis response. Missing events: ${missingEvents.join(", ")}`);
            const events = buffer.split(/\r?\n\r?\n/);

            if (done) {
                if (buffer.trim()) {
                    processEvent(buffer);
                }
                break;
            }
        }

        const missingEvents = requiredEvents.filter((eventName) => !receivedEvents.has(eventName));
        if (missingEvents.length > 0) {
            throw new Error(`Incomplete analysis response. Missing events: ${missingEvents.join(", ")}`);
        }
    } catch (error) {
        if (error.name === "AbortError") {
            throw new Error("The analysis timed out after 30 seconds without a response.");
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}