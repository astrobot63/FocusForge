// ============================================
// SUPABASE
// ============================================

const SUPABASE_URL =
    "https://wzagisnrtsclgtehhvvl.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_2yCJ2g2k7GAwvYG7DkMAlQ_OheOHNS6";

const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


// ============================================
// TIMER
// ============================================

let timerInterval = null;
let timeRemaining = 25 * 60;
let isRunning = false;

let focusDuration = 25;


const timerElement =
    document.getElementById("timer");

const timerLabel =
    document.getElementById("timer-label");

const startButton =
    document.getElementById("start-button");

const resetButton =
    document.getElementById("reset-button");

const decreaseTimeButton =
    document.getElementById("decrease-time");

const increaseTimeButton =
    document.getElementById("increase-time");

const focusDurationInput =
    document.getElementById("focus-duration");


// ============================================
// ACCOUNT
// ============================================

let currentUser = null;
let profile = null;


const loginOpenButton =
    document.getElementById("login-open-button");

const accountModal =
    document.getElementById("account-modal");

const closeAccountButton =
    document.getElementById("close-account");

const accountTitle =
    document.getElementById("account-title");

const accountMessage =
    document.getElementById("account-message");

const authForm =
    document.getElementById("auth-form");

const authEmail =
    document.getElementById("auth-email");

const authPassword =
    document.getElementById("auth-password");

const loginButton =
    document.getElementById("login-button");

const signupButton =
    document.getElementById("signup-button");

const authSwitch =
    document.getElementById("auth-switch");

const authSwitchText =
    document.getElementById("auth-switch-text");

const authSwitchButton =
    document.getElementById("auth-switch-button");

const loggedInArea =
    document.getElementById("logged-in-area");

const loggedInEmail =
    document.getElementById("logged-in-email");

const logoutButton =
    document.getElementById("logout-button");

let authMode = "login";


// ============================================
// STATS
// ============================================

const streakElement =
    document.getElementById("streak");

const xpElement =
    document.getElementById("xp");

const levelElement =
    document.getElementById("level");

const sessionsElement =
    document.getElementById("sessions");

const levelText =
    document.getElementById("level-text");

const xpProgressText =
    document.getElementById("xp-progress-text");

const xpProgress =
    document.getElementById("xp-progress");


// ============================================
// TASKS
// ============================================

const taskInput =
    document.getElementById("task-input");

const addTaskButton =
    document.getElementById("add-task");

const taskList =
    document.getElementById("task-list");

const taskCount =
    document.getElementById("task-count");

let tasks = [];


// ============================================
// SOUNDS
// ============================================

const sounds = [
    {
        name: "Rain",
        emoji: "🌧️",
        file: "rain.mp3"
    },
    {
        name: "Forest",
        emoji: "🌲",
        file: "forest.mp3"
    },
    {
        name: "Ocean",
        emoji: "🌊",
        file: "ocean.mp3"
    },
    {
        name: "White Noise",
        emoji: "📻",
        file: "white-noise.mp3"
    },
    {
        name: "Deep Focus",
        emoji: "🧠",
        file: "deep-focus.mp3"
    }
];

let currentSoundIndex = 0;
let currentAudio = null;

const soundEmoji =
    document.getElementById("sound-emoji");

const soundName =
    document.getElementById("sound-name");

const soundToggle =
    document.getElementById("sound-toggle");

const previousSound =
    document.getElementById("previous-sound");

const nextSound =
    document.getElementById("next-sound");

const soundDots =
    document.getElementById("sound-dots");


// ============================================
// NOTIFICATIONS
// ============================================

const notification =
    document.getElementById("notification");


function showNotification(message) {

    notification.textContent = message;

    notification.classList.add("show");

    setTimeout(() => {
        notification.classList.remove("show");
    }, 3000);
}


// ============================================
// TIMER
// ============================================

function updateTimerDisplay() {

    const minutes =
        Math.floor(timeRemaining / 60);

    const seconds =
        timeRemaining % 60;

    timerElement.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    document.title =
        isRunning
            ? `${timerElement.textContent} • FocusForge`
            : "FocusForge";
}


function startTimer() {

    if (isRunning) return;

    isRunning = true;

    startButton.textContent =
        "⏸ Pause";

    timerLabel.textContent =
        "Stay focused!";

    timerInterval =
        setInterval(() => {

            timeRemaining--;

            updateTimerDisplay();

            if (timeRemaining <= 0) {

                clearInterval(timerInterval);

                timerInterval = null;

                isRunning = false;

                startButton.textContent =
                    "▶ Start";

                timerLabel.textContent =
                    "Session complete!";

                completeSession();
            }

        }, 1000);
}


function pauseTimer() {

    clearInterval(timerInterval);

    timerInterval = null;

    isRunning = false;

    startButton.textContent =
        "▶ Start";

    timerLabel.textContent =
        "Paused";

    updateTimerDisplay();
}


startButton.addEventListener(
    "click",
    () => {

        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }

    }
);


// ============================================
// RESET
// ============================================

function resetTimer() {

    clearInterval(timerInterval);

    timerInterval = null;

    isRunning = false;

    focusDuration =
        Number(focusDurationInput.value) || 25;

    timeRemaining =
        focusDuration * 60;

    startButton.textContent =
        "▶ Start";

    timerLabel.textContent =
        "Ready to focus?";

    updateTimerDisplay();
}


resetButton.addEventListener(
    "click",
    () => {

        if (isRunning) {

            document
                .getElementById("reset-modal")
                .classList.add("show");

            return;
        }

        resetTimer();

    }
);


document
    .getElementById("cancel-reset")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById("reset-modal")
                .classList.remove("show");

        }
    );


document
    .getElementById("confirm-reset")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById("reset-modal")
                .classList.remove("show");

            resetTimer();

        }
    );


// ============================================
// DURATION
// ============================================

function updateDuration() {

    let value =
        Number(focusDurationInput.value);

    if (!Number.isFinite(value)) {
        value = 25;
    }

    value =
        Math.min(
            1440,
            Math.max(1, value)
        );

    focusDuration = value;

    focusDurationInput.value =
        value;

    if (!isRunning) {

        timeRemaining =
            focusDuration * 60;

        updateTimerDisplay();
    }
}


decreaseTimeButton.addEventListener(
    "click",
    () => {

        focusDurationInput.value =
            Math.max(
                1,
                Number(focusDurationInput.value) - 1
            );

        updateDuration();

    }
);


increaseTimeButton.addEventListener(
    "click",
    () => {

        focusDurationInput.value =
            Math.min(
                1440,
                Number(focusDurationInput.value) + 1
            );

        updateDuration();

    }
);


focusDurationInput.addEventListener(
    "change",
    updateDuration
);


// ============================================
// TASKS
// ============================================

function renderTasks() {

    taskList.innerHTML = "";

    const completed =
        tasks.filter(
            task => task.completed
        ).length;

    taskCount.textContent =
        `${completed} / ${tasks.length}`;


    tasks.forEach((task, index) => {

        const taskElement =
            document.createElement("div");

        taskElement.className =
            "task-item";

        if (task.completed) {
            taskElement.classList.add("completed");
        }


        const checkbox =
            document.createElement("button");

        checkbox.className =
            "task-checkbox";

        checkbox.textContent =
            task.completed ? "✓" : "";


        checkbox.addEventListener(
            "click",
            () => {

                task.completed =
                    !task.completed;

                saveTasks();

                renderTasks();

            }
        );


        const text =
            document.createElement("span");

        text.textContent =
            task.text;


        const deleteButton =
            document.createElement("button");

        deleteButton.className =
            "task-delete";

        deleteButton.textContent =
            "×";


        deleteButton.addEventListener(
            "click",
            () => {

                tasks.splice(index, 1);

                saveTasks();

                renderTasks();

            }
        );


        taskElement.appendChild(checkbox);

        taskElement.appendChild(text);

        taskElement.appendChild(deleteButton);

        taskList.appendChild(taskElement);

    });

}


function addTask() {

    const text =
        taskInput.value.trim();

    if (!text) return;

    tasks.push({
        text: text,
        completed: false
    });

    taskInput.value = "";

    saveTasks();

    renderTasks();
}


function saveTasks() {

    localStorage.setItem(
        "focusforge_tasks",
        JSON.stringify(tasks)
    );

}


function loadTasks() {

    const saved =
        localStorage.getItem(
            "focusforge_tasks"
        );

    if (!saved) return;

    try {

        tasks =
            JSON.parse(saved);

    } catch {

        tasks = [];

    }
}


addTaskButton.addEventListener(
    "click",
    addTask
);


taskInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            addTask();
        }

    }
);


// ============================================
// SOUNDS
// ============================================

function renderSound() {

    const sound =
        sounds[currentSoundIndex];

    soundEmoji.textContent =
        sound.emoji;

    soundName.textContent =
        sound.name;

    soundDots.innerHTML = "";


    sounds.forEach((_, index) => {

        const dot =
            document.createElement("span");

        dot.className =
            "sound-dot";

        if (index === currentSoundIndex) {
            dot.classList.add("active");
        }

        soundDots.appendChild(dot);

    });

}


function stopSound() {

    if (!currentAudio) return;

    currentAudio.pause();

    currentAudio.currentTime = 0;

    currentAudio = null;

    soundToggle.textContent =
        "▶ Play";
}


function playSound() {

    stopSound();

    const sound =
        sounds[currentSoundIndex];

    currentAudio =
        new Audio(sound.file);

    currentAudio.loop = true;

    currentAudio.volume = 0.35;

    currentAudio
        .play()
        .then(() => {

            soundToggle.textContent =
                "⏸ Pause";

        })
        .catch(() => {

            showNotification(
                "Couldn't play this sound."
            );

        });
}


soundToggle.addEventListener(
    "click",
    () => {

        if (currentAudio) {

            if (currentAudio.paused) {

                currentAudio.play();

                soundToggle.textContent =
                    "⏸ Pause";

            } else {

                currentAudio.pause();

                soundToggle.textContent =
                    "▶ Play";
            }

            return;
        }

        playSound();

    }
);


previousSound.addEventListener(
    "click",
    () => {

        stopSound();

        currentSoundIndex--;

        if (currentSoundIndex < 0) {
            currentSoundIndex =
                sounds.length - 1;
        }

        renderSound();

    }
);


nextSound.addEventListener(
    "click",
    () => {

        stopSound();

        currentSoundIndex++;

        if (currentSoundIndex >= sounds.length) {
            currentSoundIndex = 0;
        }

        renderSound();

    }
);


// ============================================
// XP / LEVEL
// ============================================

function getLevelFromXP(xp) {

    return Math.floor(xp / 100) + 1;

}


function updateStatsUI() {

    if (!profile) {

        streakElement.textContent = "0";

        xpElement.textContent = "0";

        levelElement.textContent = "1";

        sessionsElement.textContent = "0";

        levelText.textContent =
            "Level 1";

        xpProgressText.textContent =
            "0 / 100 XP";

        xpProgress.style.width =
            "0%";

        return;
    }


    const xp =
        profile.xp || 0;

    const streak =
        profile.streak || 0;

    const sessions =
        profile.sessions || 0;

    const level =
        getLevelFromXP(xp);

    const currentLevelXP =
        xp % 100;


    streakElement.textContent =
        streak;

    xpElement.textContent =
        xp;

    levelElement.textContent =
        level;

    sessionsElement.textContent =
        sessions;

    levelText.textContent =
        `Level ${level}`;

    xpProgressText.textContent =
        `${currentLevelXP} / 100 XP`;

    xpProgress.style.width =
        `${currentLevelXP}%`;
}


// ============================================
// PROFILE
// ============================================

async function ensureProfile(user) {

    if (!user) return null;


    const {
        data,
        error
    } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();


    if (error) {

        console.error(
            "Profile lookup failed:",
            error
        );

        return null;
    }


    if (data) {
        return data;
    }


    const {
        data: newProfile,
        error: insertError
    } = await supabaseClient
        .from("profiles")
        .insert({
            id: user.id
        })
        .select()
        .single();


    if (insertError) {

        console.error(
            "Profile creation failed:",
            insertError
        );

        return null;
    }


    return newProfile;
}


async function loadProfile(user) {

    if (
        !user ||
        !user.email_confirmed_at
    ) {

        profile = null;

        updateStatsUI();

        return;
    }


    profile =
        await ensureProfile(user);

    updateStatsUI();
}


// ============================================
// AUTH SCREEN
// ============================================

function setAuthMode(mode) {

    authMode = mode;


    if (mode === "login") {

        accountTitle.textContent =
            "Log In";

        accountMessage.textContent =
            "Log in to save your progress and earn XP.";

        loginButton.style.display =
            "block";

        signupButton.style.display =
            "none";

        authSwitchText.textContent =
            "Don't have an account?";

        authSwitchButton.textContent =
            "Sign Up";

    } else {

        accountTitle.textContent =
            "Sign Up";

        accountMessage.textContent =
            "Create an account to save your progress and earn XP.";

        loginButton.style.display =
            "none";

        signupButton.style.display =
            "block";

        authSwitchText.textContent =
            "Already have an account?";

        authSwitchButton.textContent =
            "Log In";
    }

}


function openAuth() {

    accountModal.classList.add("show");

    if (!currentUser) {

        loggedInArea.style.display =
            "none";

        authForm.style.display =
            "flex";

        authSwitch.style.display =
            "block";

        setAuthMode(authMode);

        return;
    }


    authForm.style.display =
        "none";

    authSwitch.style.display =
        "none";

    loggedInArea.style.display =
        "flex";

    accountTitle.textContent =
        "Your Account";

    accountMessage.textContent =
        "Your FocusForge progress is saved to your account.";

    loggedInEmail.textContent =
        currentUser.email;
}


loginOpenButton.addEventListener(
    "click",
    openAuth
);


closeAccountButton.addEventListener(
    "click",
    () => {

        accountModal.classList.remove("show");

    }
);


authSwitchButton.addEventListener(
    "click",
    () => {

        if (authMode === "login") {
            setAuthMode("signup");
        } else {
            setAuthMode("login");
        }

    }
);


// ============================================
// AUTH STATE
// ============================================

async function handleAuthState(user) {

    currentUser =
        user || null;


    if (!currentUser) {

        profile = null;

        loginOpenButton.textContent =
            "Log In";

        updateStatsUI();

        return;
    }


    if (!currentUser.email_confirmed_at) {

        profile = null;

        updateStatsUI();

        return;
    }


    await loadProfile(currentUser);

    loginOpenButton.textContent =
        "Account";
}


supabaseClient.auth.onAuthStateChange(
    async (_event, session) => {

        await handleAuthState(
            session?.user || null
        );

    }
);


async function initializeAuth() {

    const {
        data,
        error
    } = await supabaseClient.auth.getSession();


    if (error) {

        console.error(
            "Could not get session:",
            error
        );

        return;
    }


    await handleAuthState(
        data.session?.user || null
    );
}


initializeAuth();


// ============================================
// SIGN UP
// ============================================

signupButton.addEventListener(
    "click",
    async () => {

        const email =
            authEmail.value.trim();

        const password =
            authPassword.value;


        if (!email || !password) {

            showNotification(
                "Enter an email and password."
            );

            return;
        }


        if (password.length < 6) {

            showNotification(
                "Password must be at least 6 characters."
            );

            return;
        }


        signupButton.disabled = true;

        signupButton.textContent =
            "Creating account...";


        const {
            data,
            error
        } = await supabaseClient.auth.signUp({

            email: email,

            password: password,

            options: {
                emailRedirectTo:
                    window.location.origin
            }

        });


        signupButton.disabled = false;

        signupButton.textContent =
            "Sign Up";


        if (error) {

            showNotification(
                error.message
            );

            return;
        }


        if (data.session) {

            showNotification(
                "Account created! 🎉"
            );

            accountModal.classList.remove(
                "show"
            );

        } else {

            accountMessage.textContent =
                "Account created! Check your email and click the verification link.";

            showNotification(
                "Check your email to verify your account."
            );
        }

    }
);


// ============================================
// LOGIN
// ============================================

loginButton.addEventListener(
    "click",
    async () => {

        const email =
            authEmail.value.trim();

        const password =
            authPassword.value;


        if (!email || !password) {

            showNotification(
                "Enter your email and password."
            );

            return;
        }


        loginButton.disabled = true;

        loginButton.textContent =
            "Logging in...";


        const {
            data,
            error
        } = await supabaseClient.auth
            .signInWithPassword({
                email,
                password
            });


        loginButton.disabled = false;

        loginButton.textContent =
            "Log In";


        if (error) {

            showNotification(
                error.message
            );

            return;
        }


        if (!data.user.email_confirmed_at) {

            showNotification(
                "Please verify your email first."
            );

            return;
        }


        await handleAuthState(
            data.user
        );

        accountModal.classList.remove(
            "show"
        );

        showNotification(
            "Welcome back! 👋"
        );

    }
);


// ============================================
// LOG OUT
// ============================================

logoutButton.addEventListener(
    "click",
    async () => {

        const {
            error
        } = await supabaseClient.auth.signOut();


        if (error) {

            showNotification(
                error.message
            );

            return;
        }


        currentUser = null;

        profile = null;

        updateStatsUI();

        loginOpenButton.textContent =
            "Log In";

        accountModal.classList.remove(
            "show"
        );

        showNotification(
            "Logged out."
        );

    }
);


// ============================================
// SESSION COMPLETE
// ============================================

async function completeSession() {

    timerLabel.textContent =
        "Great work! 🎉";


    playCompletionSound();


    if (!currentUser) {

        showNotification(
            "Session complete! Log in and verify your email to earn XP."
        );

        return;
    }


    if (!currentUser.email_confirmed_at) {

        showNotification(
            "Verify your email to start earning XP."
        );

        return;
    }


    if (!profile) {

        profile =
            await ensureProfile(currentUser);
    }


    if (!profile) {

        showNotification(
            "Couldn't load your profile."
        );

        return;
    }


    profile.xp += 25;

    profile.sessions += 1;

    profile.streak += 1;


    const {
        error
    } = await supabaseClient
        .from("profiles")
        .update({
            xp: profile.xp,
            sessions: profile.sessions,
            streak: profile.streak
        })
        .eq("id", currentUser.id);


    if (error) {

        console.error(
            "Could not save progress:",
            error
        );

        showNotification(
            "Couldn't save your progress."
        );

        return;
    }


    updateStatsUI();

    showNotification(
        "+25 XP ⭐"
    );
}


// ============================================
// COMPLETION SOUND
// ============================================

function playCompletionSound() {

    const audio =
        new Audio(
            "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
        );

    audio.volume = 0.5;

    audio.play().catch(() => {});
}


// ============================================
// INITIALIZE
// ============================================

loadTasks();

renderTasks();

renderSound();

updateTimerDisplay();

updateStatsUI();

setAuthMode("login");
