import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserDeleteModal from "../../component/Header/UserDeleteModal";
import { useModal } from "../../hook/useModal";

const User = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const warningModal = useModal();

  const handleWarningCorfirm = () => {
    warningModal.close();
    navigate(`/checkPassword?next=accountDelete`);
  };
  return (
    <div>
      {openModal && (
        <UserDeleteModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          onConfirm={handleWarningCorfirm}
          title="회원 탈퇴 안내"
          message="회원 탈퇴를 진행하시겠습니까? 탈퇴 시 모든 개인정보와 서비스 이용 기록이 삭제됩니다."
          cancelText="취소"
          confirmText="계속 진행"
        />
      )}
      <button onClick={() => navigate("/login")}>로그인 화면</button>
      <button onClick={() => navigate("/join")}>회원가입 화면</button>
      <button onClick={() => navigate("/checkPassword")}>
        비밀번호 확인 화면
      </button>
      <button onClick={() => navigate("/profileUpdate")}>
        회원정보 수정 화면
      </button>
      <button onClick={() => setOpenModal(!openModal)}>삭제 모달</button>
    </div>
  );
};

export default User;
