import { h, Component } from "preact";
import styles from "./menu.css";

export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
    this.toggleShow = this.toggleShow.bind(this);
  }
  toggleShow() {
    this.setState(({ show }) => ({
      show: !show
    }));
  }
  render(props, { show }) {
    return (
      <div class={styles.menuWrapper}>
        <div class={styles.menuToggle} onClick={this.toggleShow} />
        <nav
          className={[styles.menuMain]
            .concat(show ? [styles.menuActive] : [])
            .join(" ")}
          onClick={this.toggleShow}
        >
          <a className={styles.navBlock}>Settings</a>
          <a className={styles.navBlock}>Profile</a>
          <span className={styles.navBlock}>Close</span>
        </nav>
      </div>
    );
  }
}
