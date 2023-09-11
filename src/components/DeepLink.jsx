import styled from "styled-components";

const DeepLink = ({ isOpen, closeModal }) => {
  const handleCloseModal = () => {
    closeModal();
  };

  const redirectApp = () => {
    const agent = navigator.userAgent;
    const iosSchemeUrl = "NewSmartPib://";
    const androidSchemeUrl = "wooribank";
    const androidPackage = "com.wooribank.smart.npib";
    const iosInstallUrl = "http://apps.apple.com/app/id1470181651";
    // const androidInstallUrl = "market://details?id=com.wooribank.smart.npib";

    if (agent.match(/iphone/gi) || agent.match(/ipod/gi) || agent.match(/ipad/gi)) {
      const loadDate = +new Date();
      setTimeout(() => {
        if (+new Date() - loadDate < 2000) {
          window.location.href = iosInstallUrl;
        }
      }, 1500);
      window.location.href = `${iosSchemeUrl}?{"ACTION_PARAM":{"ACTION_URL":"${encodeURIComponent("/mpb/woori?withyou=NPBNE0038")}", "ACTION_PARAM":{}, "ACTION_CODE":"ACT1009"}}`;
    } else if (agent.match(/android/gi)) {
      window.location.href = `intent://${androidPackage}#Intent;scheme=${androidSchemeUrl};S.extra_page_move_action={"ACTION_URL":"${encodeURIComponent("/mpb/woori?withyou=NPBNE0038")}", "ACTION_PARAM":{"APP_ID":"SMTMPB"}, "ACTION_CODE":"ACT1009"};package=${androidPackage};end`;
    }
  };

  return (
    <>
      {isOpen && (
        <DeepLinkBlock>
          <div className="overlay" onClick={handleCloseModal}></div> {/* overlay 추가 */}
          <div className="modal">
            <p className="title">앱을 여시겠습니까?</p>
            <div className="button-group">
              <button className="open btn" onClick={redirectApp}>
                네 열래요
              </button>
              <button className="open btn" onClick={handleCloseModal}>
                아니요
              </button>
            </div>
          </div>
        </DeepLinkBlock>
      )}
    </>
  );
};

const DeepLinkBlock = styled.div`
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  .overlay {
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5); /* 반투명한 검은색 */
  }

  .modal {
    position: relative;
    z-index: 999;
    width: 278px;
    height: 140px;
    padding: 22px 10px 10px;
    background: #f4f4f4;
    box-shadow: 0px 4px 4px rgba(192, 192, 192, 0.25);
    border-radius: 8px;
    border: 1px solid #555555;

    .title {
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 12px;
    }

    .desc {
      font-size: 12px;
      color: #777777;
    }

    .button-group {
      display: flex;
      justify-content: space-around;
      margin-top: 28px;
      .btn {
        height: 35px;
        width: 105px;
        background: #eeeeee;
        color: #555555;
        font-size: 13px;
        letter-spacing: -1px;
        border-radius: 6px;
      }

      .open {
        background: orange;
        color: #ffffff;
      }
    }
  }
`;

export default DeepLink;
