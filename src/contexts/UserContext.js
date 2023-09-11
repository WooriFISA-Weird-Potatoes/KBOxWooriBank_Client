import React from 'react';
import { RecoilRoot, atom, useRecoilState } from 'recoil';

// Recoil atom을 생성하여 user 상태를 관리합니다.
const userState = atom({
    key: 'userState', // unique ID (with respect to other atoms/selectors)
    default: null, // default value (aka initial value)
});

export const UserProvider = ({ children }) => {
    return (
        <RecoilRoot>
            {children}
        </RecoilRoot>
    );
};

export const useUser = () => {
    const [user, setUser] = useRecoilState(userState);
    return { user, setUser };
};
