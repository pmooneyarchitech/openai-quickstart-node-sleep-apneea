import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [bmiInput,
    setBMIInput
  ] = useState("");
  const [sysBPInput,
    setSysBPInput] = useState("")
  const [diaBPInput,
    setDiaBPInput] = useState("")
  const [bloodSugarInput,
    setBloodSugarInput] = useState("");
  const [result, setResult] = useState();
  const [showLoading, setShowLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    const body = { bmi: bmiInput, systolic: sysBPInput, diastolic: diaBPInput, bloodSugar: bloodSugarInput };
    console.log("body", body);
    try {
      setShowLoading( true);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      setShowLoading(false);
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <h3>Enter BMI, Systolic, Diastolic, and Blood Sugar level</h3>
        <form onSubmit={onSubmit}>
          <div>
          <input
              type="text"
              name="bmi"
              placeholder="BMI"
              value={bmiInput}
              onChange={(e) => setBMIInput(e.target.value)}
          /></div>
          <div>
          <input
              type="text"
              name="systolic"
              placeholder="Systolic HR"
              value={sysBPInput}
              onChange={(e) => setSysBPInput(e.target.value)}
          /> mm Hg</div>
          <div>
          <input
              type="text"
              name="diastolic"
              placeholder="Diastolic HR"
              value={diaBPInput}
              onChange={(e) => setDiaBPInput(e.target.value)}
          /> mm Hg</div>
          <div><input
              type="text"
              name="bloodSugar"
              placeholder="Blood Sugar"
              value={bloodSugarInput}
              onChange={(e) => setBloodSugarInput(e.target.value)}
          /> mg/dL</div>
          <input type="submit" value="Get Recommendations" />
        </form>
        { showLoading &&
          <div>Loading...</div>
        }
        <div className={styles.results}>
        {result?.split('\n').map(item => {
          return (<div className={styles.result}>{item}</div>);
        })}
        </div>
      </main>
    </div>
  );
}
