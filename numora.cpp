#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>
#include <iomanip>
using namespace std;

double medianRange(const vector<double> &data, int l, int r) {
    int len = r - l + 1;
    //safety
    if (len <= 0) { 
        return 0.0; 
    } 
    if (len % 2 == 1) {
        int i = l + len / 2; 
        return (double)data[i];
    } else {
        double a = data[l + len / 2 - 1];
        double b = data[l + len / 2];
        return ((double)a + (double)b) / 2.0;
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    double t;
    n = 0;
    double sum = 0;
    vector<double> datas = {};
    while (cin >> t) {
        datas.push_back(t);
        n++;
        sum += t;
    }
    if (n == 0) {
        return 0;
    }

    //calc mean
    double mean = sum/n;
    double minimum, maximum;
    sort(datas.begin(), datas.end());
    minimum = datas[0]; 
    maximum = datas[datas.size()-1];
    // calc median
    double median = 0;
    if (n%2 == 0) {
        median = datas[n/2] + datas[(n/2)-1];
        median /= 2;
    } else {
        median = datas[n/2]; // works because of integer division
    }
    double range = maximum-minimum;
    double squaredsum = 0;
    for (int i = 0;  i < n; i++) {
        squaredsum += (datas[i]-mean) * (datas[i]-mean);
    }
    double sd = NAN;
    if (n>1) {
      sd = sqrt(squaredsum/(n-1));
    }
    double q1, q3;
    if (n == 1) {
        q1 = q3 = (double)datas[0];
    } else if (n % 2 == 1) {
        q1 = medianRange(datas, 0, n / 2 - 1);
        q3 = medianRange(datas, n / 2 + 1, n - 1);
    } else {
        q1 = medianRange(datas, 0, n / 2 - 1);
        q3 = medianRange(datas, n / 2, n - 1);
    }
    cout << fixed << setprecision(6)
    << n << "\n" 
    << mean << "\n" 
    << sd << "\n" 
    << minimum << "\n" 
    << q1 << "\n" 
    << median << "\n" 
    << q3 << "\n" 
    << maximum << "\n";
    //range may be used in future
}
