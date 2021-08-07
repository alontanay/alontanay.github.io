#include <iostream>
#include <vector>
#include <utility>

using namespace std;
/*
0123
4567
8901
2345
6789
*/

int w = 8, h = 6;
bool board[48] = {};
vector<int> dp;

long long stupidFact(long long n) {
    long long res = 1;
    for(long long i = 2; i <= n; i ++) {
        res *= i;
    }
    return res;
}

long long sqr(long long n) {return n*n;}

long long pw2(long long n) {
    if(n == 1) {
        return 2;
    }
    return sqr(pw2(n/2))*(n % 2 ? 2 : 1);
}

int encode(bool b[]) {
    int res = 0;
    int x = w;
    int y = 0;
    int pow = 1;
    for(int i = 0; ; i ++) {
        if(x == 0) {
            while(y <= h-1) {
                res += pow;
                pow *= 2;
                y ++;
            }
            return res;
        }
        if(y == h) {
            return res;
        }
        if(b[x-1+y*w]) {
            res += pow;
            y ++;
        } else {
            x --;
        }
        pow *= 2;
    }
}

int getNextMove(bool b[]) {
    int encoding = encode(b);
    if(dp[encoding] != -2) {
        return dp[encoding];
    };
    bool nb[48] = {};
    for(int i = 0; i < w*h; i ++) {nb[i] = b[i];}
    for(int r = 0; r < h; r ++) {
        for(int i = 0; i < w*r; i ++) {nb[i] = b[i];}
        for(int c = 0; c < w; c ++) {
            if(b[c + r*w]) { continue; }
            for(int ri = 0; ri <= r; ri ++) {nb[c + ri*w] = true;}
            if(getNextMove(nb) == -1) {
                dp[encoding] = c+r*w;
                return c+r*w;
            }
        }
    }
    dp[encoding] = -1;
    return -1;
}


int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
    dp = vector<int>(pw2(w+h+2),-2);
    cout << "Solving Chomp Inefficiently...\n" << endl;
    cout << "Setting Board..." << endl;
    bool b2[] = {
        0,0,0,1,1,1,1,1,
        0,0,0,1,1,1,1,1,
        0,0,0,1,1,1,1,1,
        0,0,0,1,1,1,1,1,
        0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0
    };
    // for(int i = 0; i < w*h; i ++) {board[i] = false;};
    for(int i = 0; i < w*h; i ++) {board[i] = b2[i];}
    dp[pw2(h)-1] = -3;
    cout << encode(board) << endl;
    // board[w*h-1] = true;
    cout << "Board Set Successfully\n" << endl;

    cout << "Calculating Winning Move..." << endl;
    cout << getNextMove(board) << endl;
    cout << "YAY I DIDN'T CRASH!!!" << endl;
    return 0;    
}