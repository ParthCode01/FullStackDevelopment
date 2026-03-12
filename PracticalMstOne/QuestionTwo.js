const pr = new Promise((ok, fail) => {
    setTimeout(() => {
        let r = Math.random();
        if(r > 0.2) ok("data got"); 
        else fail("oops");
    }, 2000)
})

pr.then((d) => console.log("Yes:", d))
  .catch((e) => console.log("No:", e))