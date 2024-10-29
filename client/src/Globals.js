function AllGlobals() {}

AllGlobals.prototype.toggleCB = (cb) => {
    cb(prev => {
        console.log(!prev);
        return !prev
    });
}

AllGlobals.prototype.assignNewPlayerInfo = function (name, isSub) {
    this.name = name;
    this.singles = 0;
    this.doubles = 0;
    this.triples = 0;
    this.homeruns = 0;
    this.outs = 0;
    this.strikeouts = 0;
    this.games = 0;
    this.rbis = 0;
    this.sbs = 0;
    this.walks = 0;
    this.isSub = isSub;
}

AllGlobals.prototype.taskNumbers = Object.freeze({
    none: 0,
    add: 1,
    edit: 2,
    remove: 3
})

const Globals = new AllGlobals();
export default Globals;
