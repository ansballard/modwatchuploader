import { h } from "preact";
import styles from "./index.css";

export default ({ id, type, label, onInput, value }: {
  id: string,
  type?: "text" | "password",
  label: string,
  onInput(ev: Event),
  value: number | string
}) => (
  <div className={styles.inputContainer}>
    <div id="tag-input" className={styles.inputContainer}>
      <label>{label}</label>
      <input type={type} placeholder={label} value={value} onInput={onInput} />
    </div>
  </div>
)
