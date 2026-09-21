process.stdin.setRawMode(true);
process.stdin.on('data', (data) => {
    if (data[0] === 0x03) {
        console.log("Exiting...");
        process.exit();
    }
        if (data[2] === 0x41) {
            console.log("Up Arrow");
        } else if (data[2] === 0x42) {
            console.log("Down Arrow");
        } else if (data[2] === 0x43) {
            console.log("Right Arrow");
        } else if (data[2] === 0x44) {
            console.log("Left Arrow");
        }
    } 
);