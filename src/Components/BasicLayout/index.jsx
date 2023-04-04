/*
 * Author  Luke.Lu
 * Date  2023-02-20 18:15:55
 * LastEditors  Luke.Lu
 * LastEditTime  2023-04-04 16:52:01
 * Description
 */
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '@ant-design/icons';
import { UpOutlined } from '@ant-design/icons';
import styles from './index.module.less';

import SideNavPhoneSVG from '@/assets/icons/sideNav/phone';
import SideNavShareSVG from '@/assets/icons/sideNav/share';

const BasicLayout = (props) => {
  const [ifShowTopBtn, setIfShowTopBtn] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        setIfShowTopBtn(true);
      } else {
        setIfShowTopBtn(false);
      }
    });
  }, []);

  useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return (
    <div className={styles.wrapper}>
      {props.children}

      {ifShowTopBtn && (
        <div
          className={styles.backToTop}
          onClick={() => {
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: 'smooth'
            });
          }}
        >
          <UpOutlined />
        </div>
      )}

      <div className={styles.attachedBtn}>
        <div className={styles.item}>
          <Icon component={SideNavPhoneSVG} />
        </div>

        <div className={styles.item}>
          <Icon component={SideNavShareSVG} />
        </div>
      </div>
    </div>
  );
};

export default BasicLayout;
