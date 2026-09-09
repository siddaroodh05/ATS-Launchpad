
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
    if (!payload) return fallback;

    try {
        const parsed = typeof payload === "string" ? JSON.parse(payload) : payload;
        const errorBody = parsed.body || parsed.errorResponse || parsed;
        return errorBody.message || errorBody.detail || errorBody.error || fallback;
    } catch {
        return typeof payload === "string" && payload.trim() ? payload.trim() : fallback;
    }
};

const handleAuthenticationFailure = (status) => {
    if (status !== 401 && status !== 403) return;

    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    if (window.location.pathname !== "/login") {
        window.location.replace("/login");
    }
};

export async function apiRequest(endpoint, { method = "GET", body, signal } = {}) {
    const response = await fetch(endpoint, {
        method,
        credentials: "include",
        headers: body === undefined ? undefined : { "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal
    });

    if (!response.ok) {
        handleAuthenticationFailure(response.status);
        const message = await response.text();
        throw new Error(getErrorMessage(message, `Request failed with status ${response.status}`));
    }

    const responseText = await response.text();
    return responseText ? JSON.parse(responseText) : null;
}

export async function streamMultipart(endpoint, fields, onEvent, options = {}) {
    const {
        requiredEvents = [],
        timeoutMs = 30000,
        errorFallback = "The request failed."
    } = options;
    const formData = new FormData();
    const receivedEvents = new Set();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    Object.entries(fields).forEach(([name, value]) => {
        formData.append(name, value);
    });

    const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        body: formData,
        signal: controller.signal
    });

    if (!response.ok) {
        handleAuthenticationFailure(response.status);
        const message = await response.text();
        throw new Error(getErrorMessage(message, `Request failed with status ${response.status}`));
    }

    if (!response.body) {
        throw new Error(errorFallback);
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

        try {
            data = JSON.parse(dataText);
        } catch {
            throw new Error(getErrorMessage(dataText, "The server returned invalid analysis data."));
        }

        if (data?.error) {
            throw new Error(getErrorMessage(data, errorFallback));
        }

        receivedEvents.add(eventName);
        onEvent(eventName, data);
    };

    try {
        while (true) {
            const { value, done } = await reader.read();
            buffer += decoder.decode(value || new Uint8Array(), { stream: !done });

            const events = buffer.split(/\r?\n\r?\n/);
            buffer = events.pop() || "";
            events.filter(Boolean).forEach(processEvent);

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
            throw new Error(`The request timed out after ${timeoutMs / 1000} seconds.`);
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}