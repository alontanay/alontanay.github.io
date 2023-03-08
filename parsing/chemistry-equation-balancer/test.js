function foo(a) {
    if (!a) {
        a = 'default';
    }
    console.log(a);
}

foo();

foo([false]);