export const playSound = (file) => {
    const audio = new Audio(`/sounds/${file}`);
    audio.play().catch(err => {
        console.log("Sound blocked by browser:", err);
    });
};
