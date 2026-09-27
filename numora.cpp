#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>
#include <iomanip>
#include <sstream>
#include <string>
#include <cstdlib>
#include <cstring>
using namespace std;

static double medianRange(const vector<double> &data, int l, int r) {
    int len = r - l + 1;
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

static string calculateSummaryText(const vector<double> &data) {
    if (data.empty()) {
        return "";
    }

    vector<double> datas = data;
    sort(datas.begin(), datas.end());

    int n = static_cast<int>(datas.size());
    double sum = 0.0;
    for (double v : datas) {
        sum += v;
    }
    double mean = sum / n;
    double minimum = datas[0];
    double maximum = datas[n - 1];

    double median = 0.0;
    if (n % 2 == 0) {
        median = (datas[n / 2 - 1] + datas[n / 2]) / 2.0;
    } else {
        median = datas[n / 2];
    }

    double range = maximum - minimum;
    double squaredsum = 0.0;
    for (int i = 0; i < n; ++i) {
        squaredsum += (datas[i] - mean) * (datas[i] - mean);
    }

    double sd = NAN;
    if (n > 1) {
        sd = sqrt(squaredsum / (n - 1));
    }

    double q1, q3;
    if (n == 1) {
        q1 = q3 = datas[0];
    } else if (n % 2 == 1) {
        q1 = medianRange(datas, 0, n / 2 - 1);
        q3 = medianRange(datas, n / 2 + 1, n - 1);
    } else {
        q1 = medianRange(datas, 0, n / 2 - 1);
        q3 = medianRange(datas, n / 2, n - 1);
    }

    ostringstream out;
    out << fixed << setprecision(6)
        << n << "\n"
        << mean << "\n"
        << sd << "\n"
        << minimum << "\n"
        << q1 << "\n"
        << median << "\n"
        << q3 << "\n"
        << maximum << "\n";
    return out.str();
}

extern "C" {
char* compute_stats(const char* input) {
    if (!input) {
        input = "";
    }

    vector<double> values;
    istringstream in(input);
    double value = 0.0;
    while (in >> value) {
        values.push_back(value);
    }

    string result = calculateSummaryText(values);
    char* out = static_cast<char*>(malloc(result.size() + 1));
    if (!out) {
        return nullptr;
    }
    memcpy(out, result.c_str(), result.size() + 1);
    return out;
}
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    double value = 0.0;
    vector<double> values;
    while (cin >> value) {
        values.push_back(value);
    }

    if (values.empty()) {
        return 0;
    }

    cout << calculateSummaryText(values);
    return 0;
}
