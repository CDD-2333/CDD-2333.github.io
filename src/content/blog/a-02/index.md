---
title: '数据结构与算法A · 02 - 图的最短路径'
description: '数算A第一课出发的简单探索'
publishDate: '2026-09-09 19:32:09'
tags:
  - Algorithm
  - Class
  - Note
---
## 单源最短路径

单源最短路径问题的目的是找到图上从 **给定起点** 出发到其他图上顶点的最短路径。

## 多源最短路径

多源最短路径问题的目的是找到图上 **任意一对** 顶点间的最短路径。

从Bellman-Ford算法中，我们获得了求两点间最短路径的启发：通过dp思想，合适地选取中间状态，维护距离数组。

### 1. Floyd-Warshall算法

#### 算法描述

Floyd-Warshall算法可以处理含负权边但不含负权环的图的多源最短路径问题，采用dp思想。我们首先维护距离矩阵 $dist$，注意需要把不连通的两个节点间距离记作 $\infty$.

然后我们尝试松弛图上的边，这需要枚举每个顶点 $k$. 当枚举至第 $k$ 号顶点时，中间态的意义是：将第 $1, 2, \cdots, k$ 号顶点纳入中间点的考虑范围。

对于一对顶点 $(i, j)$, 更新距离矩阵的条件显然是 $i \to k \to j$ 的权值小于 $i \to j$ 的权值。

值得注意的是，由于我们需要保证前状态不依赖后状态，故最外层循环变量是 $k$.

复杂度显然是 $O(V^3)$ 的，这是由于我们需要枚举中间态、起点、终点三层。

#### 正确性证明

我们记 $dist_k[i][j]$ 为从 $i$ 到 $j,$ 在允许经过 $\{1, \cdots , k\}$ 为中间顶点的前提下的最短路径长度。

需要证明的命题是：当外层循环执行完第 $k$ 轮后，$dist_k[i][j]$ 对应的即是 $i \to j$ 的最优权值。

我们采用归纳法证明。当 $k = 0$ 时，$dist_0[i][j]$ 就是不允许经过任何顶点时的距离，这显然是合理的。

假设 $k - 1$ 时成立，下面我们将第 $k$ 号顶点纳入考虑。如果 $dist_{k - 1}[i][k] + dist_{k - 1}[k][j] < dist_{k - 1}[i][j],$ 那么 $dist_{k - 1}[i][j]$ 将被更新。由于不含负权环，因此我们总可以选取出一条最短路径，在这之中仅出现一次顶点 $k$。综合假设，我们已知 $dist_{k - 1}[i][k], dist_{k - 1}[k][j]$ 对应的最短简单路径上都不能含有 $k$ 号顶点的参与。因此新的 $dist[i][j]$ 即是最优的。反之，如果该条件不成立，一定有一条最短路径仅由 $1, 2, \cdots, k - 1$ 构成中间点，综上，原题得证。

#### 代码实现

```cpp
const int v = 114;
int dist[v][v];

int** Floyd-Warshall(graph, v){
	for(int i = 0; i < v; i++){ //初始化距离矩阵
		for(int j = 0; j < v; j++){
			if(i == j) dist[i][j] = 0;
			else dist[i][j] = INT_MAX;
		}
	}

	for(int i = 0; i < v; i++){ //维护距离矩阵
		for(auto& p: graph.get(i)){
			dist[i][p.first] = p.second;
		}
	}

	for(int k = 0; k < v; k++){
		for(int i = 0; i < v; i++){
			if(dist[i][k] == INT_MAX) continue;
			for(int j = 0; j < v; j++){
				if(dist[k][j] == INT_MAX) continue;
				if(dist[i][k] + dist[k][j] < dist[i][j]) dist[i][j] = dist[i][k] + dist[k][j];
			}
		}
	}

	return dist;
}
```

**为什么 $k$ 必须在最外层？** 这是由于Floyd的状态转移方程：$dist_{k}[i][j] = min(dist_{k - 1}[i][k] + dist_{k - 1}[k][j], dist_{k - 1}[i][j]).$ 规定了 **状态 $k$ 依赖状态 $k - 1.$** 如果我们把 $i, j$ 置于外层，那么当我们在更新 $k$ 时，获取的 $dist[i][j]$ 很可能不是截止到当前 $k$ 时应有的最优值！