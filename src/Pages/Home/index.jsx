/*
 * Author  Luke.Lu
 * Date  2023-03-31 18:25:17
 * LastEditors  Luke.Lu
 * LastEditTime  2023-04-04 17:06:11
 * Description
 */
import { useState } from 'react';
import InnerBox from '@/Components/InnerBox';
import styles from './index.module.less';
import SlotInput from './SlotInput';

const Home = () => {
  const [slotInput1Data, setSlotInput1Data] = useState();
  const [disable, setDisable] = useState(false);
  return (
    <InnerBox>
      <SlotInput
        className={styles.outter}
        slotList={[
          { nameEn: 'stationId', nameCh: '电站Id', isUnique: true },
          {
            nameEn: 'equip',
            nameCh: '设备'
          }
        ]}
        disable={disable}
        initData={slotInput1Data}
        updateData={() => {}}
      />
    </InnerBox>
  );
};

export default Home;
