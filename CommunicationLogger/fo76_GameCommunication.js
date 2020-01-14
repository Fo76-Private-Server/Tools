var baseAddr = Module.findBaseAddress('Fallout76.exe');
console.log('Fallout76.exe baseAddr: ' + baseAddr);

var sendEncrypted = resolveAddress('0x2E889A6');
var recvEncrypted = resolveAddress('0x2E88B6F');

Interceptor.attach(sendEncrypted, { 

    onEnter: function (args) {
        send('sendEncrypted', args[1].readByteArray(args[2].toInt32()));
    },

    onLeave: function (retval) {
    }
});

Interceptor.attach(recvEncrypted, { 

    onEnter: function (args) {
        var tempRsp = this.context.rsp;
        var decryptedNum = tempRsp.add(0xE0).readU32();
        var decryptedBuffer = tempRsp.add(0x118).readPointer().readByteArray(decryptedNum);
        send('recvEncrypted', decryptedBuffer);
    },

    onLeave: function (retval) {
    }
});

function resolveAddress(addr) {
    var result = baseAddr.add(addr); 
    return result;
}