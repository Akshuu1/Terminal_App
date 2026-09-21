// process.stdin.setRawMode(true)
// process.stdin.on('data',(data) =>{
//     if(data[0] === 0x03) {
//         process.exit();
//     } else{
//         console.log(`You have pressed ${data.toString().trim()} key which has code ${data} `);
//     }

// })
process.stdin.setRawMode(true)
process.stdin.on('data', (data) => {
    
    if(data[0] === 0x03) {
        process.exit();
    } else {
        // Pass the string and the Buffer as separate arguments!
        console.log("You have pressed", data.toString().trim(), "key which has code", data);
    }
})
