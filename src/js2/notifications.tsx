import { h } from "preact";
import styles from "./notifications.css";

export default ({ notifications }) => (
  <div className={styles.notificationsWrapper}>
    {notifications.map((notification, index) => (
      <li key={`notification-${index}`}>{notification}</li>
    ))}
  </div>
);