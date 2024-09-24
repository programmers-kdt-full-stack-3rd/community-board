import React, { useState } from "react";
import Button from "../component/common/Button";
import Textarea from "../component/common/Textarea";
import TextInput from "../component/common/TextInput";

const outerStyle: React.CSSProperties = {
	colorScheme: "light",

	display: "flex",
	flexDirection: "column",
	gap: "24px",
	boxSizing: "border-box",
	padding: "24px 24px 400px 24px",
	width: "400px",
	backgroundColor: "#ffffff",
	color: "#000000",
};

const innerStyle: React.CSSProperties = {
	display: "flex",
	gap: "16px",
	alignItems: "start",
};

const sampleText = `본 카드는 한국에서만 사용 가능합니다.
1. 본 카드는 현금과 동일하게 사용할 수 있습니다.
2. 본 카드는 재충전이 가능하며, 현금과 교환되지 않습니다.
3. 본 카드는 구매하실 때 현금 영수증을 받으실 수 있습니다.
4. 본 카드의 도난, 분실 등에 대하여 당사는 책임지지 않습니다.
5. 국내 매장에서만 이용 가능합니다. (단, 일부 매장은 제외됩니다.)
6. 카드 충전금액의 유효기간은 최종 충전 또는 사용일로부터 5년입니다.
7. 본 카드는 최종 충전 후 합계 잔액 기준 60% 이상 사용하였을 경우에만 환불이 가능합니다.`;

const UITest = () => {
	const [email, setEmail] = useState("hello@example.com");
	const [nickname, setNickname] = useState("누가사용중");
	const [password, setPassword] = useState("Password!1");
	const [multilineText, setMultilineText] = useState(sampleText);

	const handleButtonClickWith = (message: string) => () => {
		alert(message || "버튼 클릭");
	};

	const handleInputChangeWith =
		(setState: React.Dispatch<React.SetStateAction<string>>) =>
		(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			setState(event.target.value);
		};

	return (
		<div style={outerStyle}>
			<h2 style={{ margin: "0" }}>버튼 컴포넌트</h2>

			<div style={innerStyle}>
				<Button
					color="primary"
					variant="solid"
					onClick={handleButtonClickWith('variant="solid"')}
				>
					채우기
				</Button>
				<Button
					color="primary"
					variant="outline"
					onClick={handleButtonClickWith('variant="outline"')}
				>
					라인
				</Button>
				<Button
					color="primary"
					variant="text"
					onClick={handleButtonClickWith('variant="text"')}
				>
					텍스트만
				</Button>
			</div>

			<div style={innerStyle}>
				<Button
					size="large"
					color="primary"
					onClick={handleButtonClickWith('size="large"')}
				>
					큰 버튼
				</Button>
				<Button
					size="medium"
					color="primary"
					onClick={handleButtonClickWith('size="medium"')}
				>
					중간 버튼
				</Button>
				<Button
					size="small"
					color="primary"
					onClick={handleButtonClickWith('size="small"')}
				>
					작은 버튼
				</Button>
			</div>

			<div style={innerStyle}>
				<Button
					size="medium"
					color="primary"
					onClick={handleButtonClickWith('color="primary"')}
				>
					메인
				</Button>
				<Button
					size="medium"
					color="action"
					onClick={handleButtonClickWith('color="action"')}
				>
					행동
				</Button>
				<Button
					size="medium"
					color="neutral"
					onClick={handleButtonClickWith('color="neutral"')}
				>
					중립
				</Button>
				<Button
					size="medium"
					color="danger"
					onClick={handleButtonClickWith('color="danger"')}
				>
					위험
				</Button>
			</div>

			<hr
				style={{
					border: "0",
					backgroundColor: "lightgray",
					width: "100%",
					height: "1px",
				}}
			/>

			<h2 style={{ margin: "0" }}>텍스트 입력 컴포넌트</h2>

			<div style={innerStyle}>
				<TextInput
					id="email"
					label="이메일"
					value={email}
					onChange={handleInputChangeWith(setEmail)}
					actionButton={
						<Button
							size="small"
							color="primary"
							onClick={handleButtonClickWith("이메일 중복 확인")}
						>
							중복 확인
						</Button>
					}
				/>
			</div>

			<div style={innerStyle}>
				<TextInput
					id="nickname"
					label="닉네임"
					value={nickname}
					onChange={handleInputChangeWith(setNickname)}
					isValid={false}
					errorMessage="이미 사용 중인 닉네임입니다."
					actionButton={
						<Button
							size="small"
							color="primary"
							onClick={handleButtonClickWith("닉네임 중복 확인")}
						>
							중복 확인
						</Button>
					}
				/>
			</div>

			<div style={innerStyle}>
				<TextInput
					id="password"
					type="password"
					label="비밀번호"
					value={password}
					onChange={handleInputChangeWith(setPassword)}
				/>
			</div>

			<div style={innerStyle}>
				<Textarea
					value={multilineText}
					onChange={handleInputChangeWith(setMultilineText)}
				/>
			</div>
		</div>
	);
};

export default UITest;
