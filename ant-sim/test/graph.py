a = None
b = None


def generate():
    global a, b
    a = [1, 2, 3]
    b = [4, 5, 6]


def get_a():
    # global a
    return a
