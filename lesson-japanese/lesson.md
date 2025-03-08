# インタラクティブな数学とJavaScriptレッスン：関数のグラフ化と交点の探索

このレッスンでは、学生が数学的概念を視覚的に示すインタラクティブなグラフ計算機を作成する過程で、JavaScriptプログラミングの基本概念を学びます。

## 学習目標

このレッスンを終えると、学生は以下のことができるようになります：
1. JavaScriptで数学関数を表現する方法を理解する
2. HTML canvasで基本的な座標系を作成する
3. JavaScriptを使って関数をプロットする
4. 関数間の交点を見つけるアルゴリズムを実装する
5. 数学的概念とプログラミングの応用を結びつける

## 前提条件

- HTMLの基本的な理解
- 数学関数と座標系への親しみ
- JavaScriptの変数と関数の基本的な知識

## レッスン構成

### パート1：Canvasの設定（20分）
- HTML canvas要素の理解
- canvasの初期化とコンテキストの取得
- 寸法の設定と描画の準備

### パート2：座標系の作成（30分）
- 数学的座標からcanvas座標への変換
- 軸とグリッドマークの描画
- ラベルと目盛りの追加

### パート3：数学関数のプロット（40分）
- JavaScriptでの数学関数の定義
- 関数の視覚的表現への変換
- ループを使ってポイントをプロットし、連続曲線を作成

### パート4：交点の検索（40分）
- 交点を見つける数学的アプローチの理解
- 関数が交差するタイミングを検出するアルゴリズムの実装
- 交点の精度を高める方法

### パート5：インタラクティブな拡張（オプション 30分）
- ズーム機能の追加
- ユーザーからの関数入力の有効化
- 視覚表示の強化

## 詳細なレッスンガイド

### パート1：Canvasの設定

まず、HTML canvasが描画面としてどのように機能するかを説明します：

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Function Grapher</title>
</head>
<body>
    <canvas id="canvas"></canvas>
</body>
<script>
    // JavaScriptはここに記述します
</script>
</html>
```

JavaScriptでの初期canvas設定を説明します：

```javascript
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 800
canvas.height = 800

// グリッドの各マスの大きさを決める倍率を設定します
const gridSize = 50
```

**議論ポイント：**
- canvas要素とは何か、そして数学的視覚化にどのように役立つのか？
- canvasの座標系と数学的座標系はどのように異なるのか？
- コンテキスト（ctx）は何を可能にするのか？

### パート2：座標系の作成

数学座標とcanvas座標の変換方法を説明します：

```javascript
// 原点(0,0)がcanvasのどこに位置するかを定義
let originX = canvas.width / 2
let originY = canvas.height / 2

// これらの関数は数学座標からcanvas座標に変換します
const toCanvasX = (x) => originX + (x * gridSize)
const toCanvasY = (y) => originY - (y * gridSize)
```

次に座標系の描画方法を示します：

```javascript
const drawCoordinateSystem = () => {
    // まずcanvasをクリアする
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // X軸とY軸を描画
    ctx.lineWidth = 1
    ctx.strokeStyle = '#000000'
    
    // X軸
    ctx.beginPath()
    ctx.moveTo(0, originY)
    ctx.lineTo(canvas.width, originY)
    ctx.stroke()
    
    // Y軸
    ctx.beginPath()
    ctx.moveTo(originX, 0)
    ctx.lineTo(originX, canvas.height)
    ctx.stroke()
    
    // 必要に応じて目盛りとラベルを追加
    // ...
}
```

**議論ポイント：**
- なぜ座標系間の変換が必要なのか？
- Y軸はcanvasと数学座標でどのように異なるのか？
- gridSize変数を変更するとどうなるのか？

### パート3：数学関数のプロット

JavaScriptでの数学関数の定義方法を説明します：

```javascript
// 関数例：放物線と別の曲線
const f1 = (x) => Math.pow(x, 2) - 4       // y = x² - 4
const f2 = (x) => -Math.pow(x, 2) - 2*x + 2  // y = -x² - 2x + 2
```

次に、これらの関数をプロットする方法を示します：

```javascript
const plotFunction = (fn, color = '#FF0000', stepSize = 0.1) => {
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    
    // canvasのサイズに基づいてx値の範囲を計算
    const startX = -(originX / gridSize)
    const endX = (canvas.width - originX) / gridSize
    
    let firstPoint = true
    
    // 関数をポイントごとにプロット
    for(let x = startX; x <= endX; x += stepSize) {
        const y = fn(x)
        const canvasX = toCanvasX(x)
        const canvasY = toCanvasY(y)
        
        if (firstPoint) {
            ctx.moveTo(canvasX, canvasY)
            firstPoint = false
        } else {
            ctx.lineTo(canvasX, canvasY)
        }
    }
    
    ctx.stroke()
}
```

**議論ポイント：**
- ステップサイズはグラフの滑らかさにどのように影響するのか？
- 視覚化すると興味深い数学関数は何か？
- 垂直漸近線や不連続点をどのように処理できるか？

### パート4：交点の検索

交点を見つけるアルゴリズムを説明します：

```javascript
const findIntersections = (f1, f2, start = -10, end = 10, step = 0.01) => {
    const intersections = []
    
    // 関数が交差する点を探すためにx軸をスキャン
    for(let x = start; x <= end; x += step) {
        const y1 = f1(x)
        const y2 = f2(x)
        const nextX = x + step
        const nextY1 = f1(nextX)
        const nextY2 = f2(nextX)
        
        // 差の符号が変わる場合、交点がある
        if ((y1 - y2) * (nextY1 - nextY2) <= 0) {
            // 二分探索で交点を精緻化
            let left = x
            let right = nextX
            for(let i = 0; i < 10; i++) {
                const mid = (left + right) / 2
                const midY1 = f1(mid)
                const midY2 = f2(mid)
                if ((f1(left) - f2(left)) * (midY1 - midY2) <= 0) {
                    right = mid
                } else {
                    left = mid
                }
            }
            
            const intersectX = (left + right) / 2
            const intersectY = f1(intersectX)
            
            intersections.push({
                x: Math.round(intersectX * 100) / 100,
                y: Math.round(intersectY * 100) / 100
            })
        }
    }
    
    return intersections
}
```

**議論ポイント：**
- なぜ関数の差の符号の変化を探すのか？
- 二分探索とは何か、そして交点を精緻化するのになぜ有用なのか？
- ステップサイズは交点の精度にどのように影響するのか？

### パート5：統合と拡張

最後に、すべての部分を統合し、視覚要素を追加する方法を示します：

```javascript
const drawAll = () => {
    drawCoordinateSystem()
    
    // 関数のプロット
    plotFunction(f1, '#FF0000')  // 一つ目の関数は赤
    plotFunction(f2, '#0000FF')  // 二つ目の関数は青
    
    // 交点を探して表示
    const intersections = findIntersections(f1, f2)
    drawIntersectionPoints(intersections)
}

// 交点を視覚化する関数を定義
const drawIntersectionPoints = (intersections) => {
    ctx.fillStyle = '#008000'  // 交点は緑
    
    intersections.forEach(point => {
        const canvasX = toCanvasX(point.x)
        const canvasY = toCanvasY(point.y)
        
        // 点を描画
        ctx.beginPath()
        ctx.arc(canvasX, canvasY, 5, 0, Math.PI * 2)
        ctx.fill()
        
        // 座標のラベル
        ctx.fillStyle = '#000000'
        ctx.fillText(`(${point.x}, ${point.y})`, canvasX + 10, canvasY - 5)
    })
}

// メイン描画関数を呼び出し
drawAll()
```

**拡張アイデア：**
- 関数パラメータを変更するスライダーを追加
- ズームとパン機能を実装
- ユーザーが独自の関数を入力できるようにする
- 根、最大値、最小値を見つける機能を追加

## 教室でのアクティビティ

1. **関数探索**：学生に関数を変更させ、グラフと交点がどのように変化するかを観察させる。

2. **アルゴリズム分析**：交点検索アルゴリズムの効率性と改善方法について議論する。

3. **創造的チャレンジ**：複数の関数を組み合わせて視覚的に興味深いパターンを作成するよう学生に依頼する。

4. **数学的つながり**：学生に代数的に交点を解かせ、プログラムを使ってその答えを検証させる。

5. **実世界への応用**：交点を探す作業が経済学における損益分岐点の発見などの実世界の問題とどのように関連するかを議論する。

## 評価アイデア

1. 曲線間の面積を求めるなど、新機能の実装を学生に依頼する
2. 異なるタイプの関数（三角関数など）を扱うようにコードを変更するよう学生に依頼する
3. 性能向上のためにコードを最適化するよう学生に挑戦させる
4. コードの一側面を説明する教育用ミニプレゼンテーションを学生に作成させる

## リソース

- [MDN Canvas API ドキュメント](https://developer.mozilla.org/ja/docs/Web/API/Canvas_API)
- [JavaScriptでの数学関数](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math)
- [二分探索アルゴリズム](https://ja.wikipedia.org/wiki/%E4%BA%8C%E5%88%86%E6%8E%A2%E7%B4%A2)