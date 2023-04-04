/*
 * Author  Luke.Lu
 * Date  2023-03-01 21:54:34
 * LastEditors  Luke.Lu
 * LastEditTime  2023-03-04 16:36:42
 * Description
 */
import styles from './index.module.less';

const InnerBox = (props) => (
  <div className={`${styles.innerBox} ${props.className ? props.className : ''}`}>{props.children}</div>
);

export default InnerBox;
