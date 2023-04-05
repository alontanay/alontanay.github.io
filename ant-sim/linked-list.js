class LinkedNode {
    constructor(val = null, next = null) {
        if (val instanceof LinkedNode) {
            this.val = val.val;
            this.next = val.next;
            return;
        }
        this.val = val;
        this.next = next;
    }
}

class LinkedList {
    constructor(valsOrSize = null) {
        this.head = null;
        if (typeof valsOrSize === 'number') { valsOrSize = new Array(valsOrSize); }
        if (valsOrSize instanceof Array) {
            for (let val of valsOrSize) {
                this.push(val);
            }
        }
    }
    clear() {
        this.head = null;
    }
    isEmpty() {
        return this.head === null;
    }
    push(val) {
        let newNode = new LinkedNode(val, this.head);
        this.head = newNode;
    }
    pop() {
        if (this.head) {
            this.head = this.head.next;
            return true;
        }
        return false;
    }
    findAndRemove(call) {
        if (this.isEmpty()) { return null; }
        if (call(this.head.val)) {
            let ret = this.head.val;
            this.pop();
            return ret;
        }
        let preNode = this.head;
        let curNode = preNode.next;
        while (curNode) {
            if (call(curNode.val)) {
                let ret = curNode.val;
                preNode.next = curNode.next;
                return ret;
            }
            preNode = curNode;
            curNode = curNode.next;
        }
        return null;
    }
}
