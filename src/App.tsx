import { useState } from "react";
type resultType = number[] | never[];

const App = () => {
  const [inputData, setInputData] = useState("");
  const [velocity, setVelocity] = useState<resultType>([]);
  const [results, setResults] = useState<resultType>([]);

  const handleCalculate = (data: string) => {
    const rows = data
      .trim()
      .split("\n")
      .map((row) => row.split(/\s+/).map(Number));
    calculateResults(rows);
  };

  const calculateResults = (data: any[]) => {
    const diffData = [];
    for (let i = 0; i < data.length - 1; i++) {
      const result = linearEquation(data[i], data[i + 1]);
      if (result) {
        diffData.push(result);
      }
    }

    const v = diffData.map((d) => 1 / d[0]);
    const x = data.slice(1).map((d) => d[0]);

    const h = souatsu(x, v);
    setVelocity(v);
    setResults(h);
  };

  function orgRound(value: number, base: number) {
    return Math.round(value * base) / base;
  }

  const linearEquation = (x1: number[], x2: number[]) => {
    if (x1[0] === x2[0] || x1[1] === x2[1]) return null;
    const a = (x1[1] - x2[1]) / (x1[0] - x2[0]);
    const b = x1[1] - a * x1[0];
    return [a, b];
  };

  const souatsu = (x: string | any[], v: number[]) => {
    const h = [];
    for (let i = 0; i < x.length - 1; i++) {
      let a = (x[i] / 2) * Math.sqrt((v[i + 1] - v[i]) / (v[i + 1] + v[i]));
      for (let j = 0; j < i; j++) {
        a -=
          (h[j] *
            (v[i] * Math.sqrt(v[i + 1] ** 2 - v[j] ** 2) -
              v[i + 1] * Math.sqrt(v[i] ** 2 - v[j] ** 2))) /
          (v[j] * Math.sqrt(v[i + 1] ** 2 - v[i] ** 2));
      }
      h.push(a);
    }
    return h;
  };

  return (
    <div>
      <h1>地震波速度計算ツール</h1>
      <p>
        <code>
          このツールは, 2024年度東京大学理学部地球惑星物理学科3年の学生が実習目的で作成したものです.
        </code>
      </p>
      <p>
        <code>それ以外の目的で使用することを妨げるものではありませんが, 使用は自己責任の範囲で行ってください.</code>
      </p>
      <textarea
        rows={10}
        cols={50}
        value={inputData}
        onChange={(e) => {
          setInputData(e.target.value);
          handleCalculate(e.target.value);
        }}
        placeholder="0.0 0.0
16.0 0.078
110 0.2"
      ></textarea>
      <br />
      {/* <button onClick={handleCalculate}>計算</button> */}
      <div>
        <h2>結果</h2>
        <p>
          <textarea placeholder="memo"></textarea>
        </p>
        <ul>
          {results.map((result, index) => (
            <li key={index}>{`${index + 1}層目: 地震波速度 ${orgRound(
              velocity[index],
              10000
            )} m/s, 層厚 ${orgRound(result, 10000)} m`}</li>
          ))}
          {results.length >= 0 && (
            <li key={-1}>{`${results.length + 1}層目: 地震波速度 ${orgRound(
              velocity[results.length],
              10000
            )} m/s`}</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default App;
