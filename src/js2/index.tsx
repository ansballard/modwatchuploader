import { h, render, Component } from "preact";
import styles from "./index.css";

import Menu from "./menu";
import Notifications from './notifications';
import InputContainer from "./inputContainer";

const Container = props => (
  <div>
    <header>
      <h1 className={styles.header}>
        <a className={styles.noUnderline}>
          MODWATCH
        </a>
      </h1>
    </header>
    <div className={styles.contentWrapper}>
      <Notifications notifications={["this is a test"]} />
      <Menu />
      <section>
        <InputContainer onInput={console.log} value={"Peanut"} id="username" label="Username" />
        <InputContainer onInput={console.log} value={"Password"} id="password" label="Password" />
        {/* <div className={styles.inputContainer}>
          <label>Username</label>
          <input type="text" />
        </div> */}
        {/* <div className={styles.inputContainer}>
          <label>Password</label>
          <input type="password" />
        </div> */}
      </section>
      <section>
        <div id="tag-input" className={styles.inputContainer}>
          <label>Tag</label>
          <input type="text" />
        </div>
        <div id="enb-input" className={styles.inputContainer}>
          <label>ENB</label>
          <input type="text" />
        </div>
      </section>
      <section>
        <div className={styles.inputContainer}>
          <label>Game</label>
          <select>
            <option>
              {/* {{game.display}} */}
            </option>
          </select>
        </div>
      </section>
    </div>
  </div>
);

render(<Container />, document.getElementById("modwatch-root"));
