/*
 * Author  Luke.Lu
 * Date  2023-03-24 10:28:06
 * LastEditors  Luke.Lu
 * LastEditTime  2023-04-04 16:56:21
 * Description
 *
 */
import { Button, Select } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import styles from './index.module.less';
import _ from 'lodash';
const { Option } = Select;

/**
 * @props: className, slotList, dataToSubmit, resetFlag
 */
const SlotInput = (props) => {
  const [initData, setInitData] = useState();
  const [disabledSlotList, setDisabledSlotList] = useState(new Set());
  const [slotSelectorVisible, setSlotSelectorVisible] = useState(false);
  const [slotSelectPosition, setSlotSelectPosition] = useState({ x: 0, y: 0 });

  const observerRef = useRef();
  const inputRef = useRef();
  const caretSpanRef = useRef();
  const rangeSaver = useRef();
  const isCompositing = useRef();

  const keyCodesIgnore = [8, 37, 38, 39, 40];

  const initializeData = () => {
    const regProbe = /\$.*?\$/g;
    const enArr = props.initData.typeEn?.split(' ');

    if (!enArr) return;
    const tempArr = enArr.map((item, index) => {
      if (item.match(regProbe)) {
        return (
          <span
            key={index}
            className={styles.slotSpan}
            contentEditable={false}
            data-tag-type='slotSpan'
            data-name-en={enArr[index].replaceAll('$', '')}
            data-is-unique={item.isUnique || false}
          >
            {props.slotList?.find((slot) => slot.nameEn === item.replaceAll('$', ''))?.nameCh}
            <em className={styles.closeIcon} data-tag-type='closeEm' />
          </span>
        );
      } else {
        return (
          <span key={index} className={styles.textSpan} data-tag-type='textSpan'>
            {item + ' '}
          </span>
        );
      }
    });
    setInitData(tempArr);
  };

  const detectSlotSpans = () => {
    if (inputRef.current.childNodes.length > 0) {
      const slotSpans = [];
      inputRef.current.childNodes.forEach((node) => {
        if (node.nodeType === 1 && node.dataset.tagType === 'slotSpan') slotSpans.push(node);
      });

      if (!props.slotList) return;

      const tempDisableList = _.cloneDeep(disabledSlotList);
      props.slotList.map((slot) => {
        if (slot.isUnique) {
          if (slotSpans.find((slotSpan) => slotSpan.dataset.nameEn === slot.nameEn)) {
            tempDisableList.add(slot.nameEn);
          } else {
            tempDisableList.delete(slot.nameEn);
          }
        }
      });
      setDisabledSlotList(tempDisableList);
    }
  };

  const inputObserving = () => {
    if (observerRef.current) observerRef.current = null;
    observerRef.current = new MutationObserver(() => {
      if (inputRef.current.childNodes.length === 0) {
        inputRef.current.appendChild(caretSpanRef.current);
      } else if (inputRef.current.childNodes.length === 1 && inputRef.current.childNodes[0].localName === 'br') {
        inputRef.current.childNodes[0].remove();
        inputRef.current.appendChild(caretSpanRef.current);
      }

      detectSlotSpans();
    });

    observerRef.current.observe(inputRef.current, { attributes: false, childList: true, subtree: false });
  };

  useEffect(() => {
    inputObserving();
  }, [props.slotList]);

  const showSlotSelection = () => {
    const r = document.getSelection().getRangeAt(0);
    const node = r.startContainer;
    const offset = r.startOffset;
    const pageOffset = { x: window.pageXOffset, y: window.pageYOffset };
    let rect, r2;

    if (offset > 0) {
      r2 = document.createRange();
      r2.setStart(node, offset - 1);
      r2.setEnd(node, offset);
      rect = r2.getBoundingClientRect();
      setSlotSelectorVisible(true);
      setSlotSelectPosition({ x: rect.right + pageOffset.x, y: rect.bottom + pageOffset.y - window.scrollY });
    }
  };

  useEffect(() => {
    if (props.resetFlag) {
      inputRef.current.innerHTML = '';
      inputRef.current.appendChild(caretSpanRef.current);
    }
  }, [props.resetFlag]);

  const keyUpHandler = (e) => {
    if (isCompositing.current || slotSelectorVisible) return;

    if (keyCodesIgnore.includes(e.keyCode)) return;

    const sel = window.getSelection();
    const range = sel.getRangeAt(0);

    const caretSpanNode = range.startContainer.parentNode;
    if (caretSpanNode.dataset.tagType === 'caretSpan') {
      const textSpan = document.createElement('span');
      textSpan.className = styles.textSpan;
      textSpan.innerHTML = range.startContainer.data;
      textSpan.dataset.tagType = 'textSpan';

      caretSpanNode.before(textSpan);
      caretSpanNode.innerHTML = '&#8203;';

      const newRange = document.createRange();
      newRange.selectNode(textSpan.childNodes[0]);
      newRange.collapse(false);
      sel.removeAllRanges();
      sel.addRange(newRange);

      inputRef.current.appendChild(caretSpanRef.current);
      rangeSaver.current = newRange;
    } else {
      rangeSaver.current = range;
    }

    // 弹窗出现的时机判断
    if (
      range.commonAncestorContainer.data &&
      range.commonAncestorContainer.data.substr(0, range.endOffset).endsWith(' @')
    ) {
      showSlotSelection();
    }
    // TODO: 优化出现时机判断
    // if (e.keyCode === 50) {
    //   if (range.commonAncestorContainer.data) {
    //     if (range.commonAncestorContainer.data.substr(0, range.endOffset).endsWith(' @')) showSlotSelection();
    //   } else {
    //     showSlotSelection();
    //   }
    // }
  };

  const insertTag = (slotData) => {
    const range = rangeSaver.current;

    const slotSpan = document.createElement('span');
    slotSpan.className = styles.slotSpan;
    slotSpan.contentEditable = 'false';
    slotSpan.dataset.tagType = 'slotSpan';

    slotSpan.innerHTML = slotData.nameCh;
    slotSpan.dataset.nameEn = slotData.nameEn;

    const closeIcon = document.createElement('em');
    closeIcon.className = styles.closeIcon;
    closeIcon.dataset.tagType = 'closeEm';
    slotSpan.appendChild(closeIcon);

    const currentTextNode = range.commonAncestorContainer;
    if (currentTextNode.nodeType === 3 && currentTextNode.parentNode.dataset.tagType === 'textSpan') {
      // 处于text节点中间，进行截断
      if (range.endOffset < currentTextNode.length) {
        let leftPart = currentTextNode.data.substr(0, range.endOffset);
        const rightPart = currentTextNode.data.substr(range.endOffset, currentTextNode.length);

        const leftTextSpan = document.createElement('span');
        leftTextSpan.className = styles.textSpan;
        if (leftPart.endsWith(' @')) {
          leftPart = leftPart.substr(0, leftPart.length - 1);
        }
        leftTextSpan.innerText = leftPart;
        leftTextSpan.dataset.tagType = 'textSpan';

        const rightTextSpan = document.createElement('span');
        rightTextSpan.className = styles.textSpan;
        rightTextSpan.innerText = rightPart;
        rightTextSpan.dataset.tagType = 'textSpan';

        currentTextNode.parentNode.after(rightTextSpan);
        currentTextNode.parentNode.after(slotSpan);
        currentTextNode.parentNode.after(leftTextSpan);
        currentTextNode.parentNode.remove();
      } else {
        currentTextNode.textContent = currentTextNode.data.substr(0, currentTextNode.data.length - 1);
        range.startContainer.parentNode.after(slotSpan);
      }
    }

    // 重新聚焦并且移动caret至最后
    inputRef.current.focus();
    inputRef.current.appendChild(caretSpanRef.current);

    range.selectNodeContents(caretSpanRef.current.childNodes[0]);
    range.collapse(false);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const PasteHandler = (e) => {
    e.preventDefault();

    const data = e.clipboardData.getData('text');
    const textSpan = document.createElement('span');
    textSpan.className = styles.textSpan;
    textSpan.innerHTML = data;
    textSpan.dataset.tagType = 'textSpan';

    caretSpanRef.current.before(textSpan);
  };

  const compositionStartHandler = (e) => {
    const sel = window.getSelection();
    const range = sel.getRangeAt(0);
    isCompositing.current = true;

    rangeSaver.current = range;
  };

  const compositionEndHandler = (e) => {
    const sel = window.getSelection();
    const range = rangeSaver.current;

    const caretSpanNode = range.startContainer.parentNode;
    if (caretSpanNode.dataset.tagType === 'caretSpan') {
      const textSpan = document.createElement('span');
      textSpan.className = styles.textSpan;
      textSpan.innerHTML = e.data;
      textSpan.dataset.tagType = 'textSpan';

      caretSpanNode.before(textSpan);
      caretSpanNode.innerHTML = '&#8203;';

      const newRange = document.createRange();
      newRange.selectNodeContents(textSpan.childNodes[0]);
      newRange.collapse(false);
      sel.removeAllRanges();
      sel.addRange(newRange);

      rangeSaver.current = newRange;
    }

    setTimeout(() => {
      isCompositing.current = false;
    }, 300);
  };

  const processData = () => {
    const contentNodes = [...inputRef.current.childNodes];
    let typeChString = '';
    let typeEnString = '';
    let slotString = '';

    contentNodes.map((node) => {
      if (!node?.dataset) return;
      if (node.dataset?.tagType === 'textSpan') {
        typeChString += node.innerText;
        typeEnString += node.innerText;
      } else if (node.dataset.tagType === 'slotSpan') {
        typeChString += '$' + node.innerText + '$ ';
        typeEnString += '$' + node.dataset.nameEn + '$ ';
        slotString += node.dataset.nameEn + ';';
      }
    });

    const data = { typeCh: typeChString, typeEn: typeEnString, slotString: slotString };
    props.updateData(data);
  };

  useEffect(() => {
    if (props.initData) initializeData();
  }, [props.initData]);

  return (
    <div className={styles.wrapper}>
      <div
        ref={inputRef}
        style={props?.style ? { ...props.style } : {}}
        className={`${styles.RCinput} ${props.className || ''} ${props.disable ? styles.disable : ''} ${
          props?.errors && props?.errors?.length > 0 && props?.errors[0] !== '' ? styles.hasError : ''
        }`}
        contentEditable={props.disable ? false : true}
        // TODO: 增加占位提示
        // placeholder={props.placeholder || '请输入槽位'}
        suppressContentEditableWarning={true}
        onKeyUp={keyUpHandler}
        onCompositionStart={compositionStartHandler}
        onCompositionEnd={compositionEndHandler}
        onBlur={() => {
          processData();
        }}
        onPaste={PasteHandler}
        onClick={(e) => {
          if (props.disable) return;
          if (e.target.dataset.tagType === 'closeEm') {
            const targetSlotSpan = e.target.parentNode;
            inputRef.current.removeChild(targetSlotSpan);
          }
        }}
        data-tag-type='parentDiv'
      >
        {initData ? initData : ''}
        <span id='caretSpan' data-tag-type='caretSpan' className={styles.caretSpan} ref={caretSpanRef}>
          &#8203;
        </span>
      </div>
      {props.errors &&
        props.errors[0] !== '' &&
        props.errors.map((error, index) => {
          return (
            <p className={styles.errorTip} key={index}>
              {error}
            </p>
          );
        })}
      <p className={styles.inputTip}>输入&quot;空格+@&quot;激活槽位选择</p>

      {slotSelectorVisible && (
        <div
          className={styles.selectOverlay}
          onKeyUp={(e) => {
            if (e.keyCode === 27) {
              setSlotSelectorVisible(false);
            }
          }}
          onClick={() => {
            setSlotSelectorVisible(false);
          }}
        >
          <Select
            defaultOpen={true}
            style={{
              position: 'fixed',
              left: slotSelectPosition.x,
              top: slotSelectPosition.y,
              zIndex: 1000,
              width: 200
            }}
            onSelect={(value) => {
              insertTag(props.slotList?.find((slot) => slot.nameEn === value));
              setSlotSelectorVisible(false);
            }}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            onBlur={() => {
              setSlotSelectorVisible(false);
            }}
            placeholder='请选择槽位'
          >
            {props.slotList?.map((slot, index) => (
              <Option value={slot.nameEn} key={index} disabled={disabledSlotList.has(slot.nameEn)}>
                {slot.nameCh}
              </Option>
            ))}
          </Select>
        </div>
      )}
    </div>
  );
};

export default SlotInput;
