import * as React from 'react';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import DaumPostCode from '../components/DaumPostcode';
import { Button, CssBaseline, TextField, FormControlLabel, Checkbox, ButtonGroup, Autocomplete, Grid, Box, Typography, Container, Dialog, DialogContent } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import api from '../util/api';

const defaultTheme = createTheme({
    typography: {
        fontFamily: 'KBO-Dia-Gothic_light',
    },
});

export default function SignUp() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        getValues,
        watch,
        clearErrors,
    } = useForm({
        mode: 'onSubmit',
    });

    const [selectedGender, setSelectedGender] = useState(null);
    const [selectedClub, setSelectedClub] = useState(null); // 초기값을 null로 설정
    const [svcAgmt, setSvcAgmt] = useState(false);
    const [infoAgmt, setInfoAgmt] = useState(false);
    const [address, setAddress] = useState('');
    const [open, setOpen] = useState(false);
    const [isIdChecked, setIsIdChecked] = useState(false);
    const [isIdDuplicated, setIsIdDuplicated] = useState(false);
    const navigate = useNavigate();

    const selectClub = [
        { value: 'LG', label: 'LG 트윈스', picture: '3NqgO_dpTThWu3KBf600tg' },
        { value: 'KT', label: 'KT 위즈', picture: 'LUZj3ojt_H6lYisolvQ2pg' },
        { value: 'SSG', label: 'SSG 랜더스', picture: '171JeGI-4meYHLIoUPjerQ' },
        { value: 'NC', label: 'NC 다이노스', picture: 'dDCbStDchWQktsZf2swYyA' },
        { value: 'DOOSAN', label: '두산 베어스', picture: 'AP_sE5nmR8ckhs_zEhDzEg' },
        { value: 'KIA', label: 'KIA 타이거즈', picture: 'psd7z7tnBo7SD8f_Fxs-yg' },
        { value: 'LOTTE', label: '롯데 자이언츠', picture: 'cGrvIuBYzj4D6KFLPV1MBg' },
        { value: 'SAMSUNG', label: '삼성 라이온즈', picture: 'c_Jn4jW-NOwRtnGE7uQRAA' },
        { value: 'HANWHA', label: '한화 이글스', picture: 'pq5JUk7H0b6KX5Wi8M0xbA' },
        { value: 'KIWOOM', label: '키움 히어로즈', picture: 'BXbvDpPIJZ_HpPL4qikxNg' },
    ];

    const checkIdDuplication = async () => {
        const userId = getValues('userId');
        const response = await api.get('/auth/check', { params: { userId } });
        if (response.data.status === 1000) {
            alert('사용 가능한 아이디입니다.');
            setIsIdChecked(true);
            setIsIdDuplicated(false);
        } else if (response.data.status === 1101) {
            alert('이미 사용중인 아이디입니다.');
            setIsIdChecked(true);
            setIsIdDuplicated(true);
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAllAgree = () => {
        setSvcAgmt(true);
        setInfoAgmt(true);
    };

    const onSubmit = async (data) => {
        if (!svcAgmt || !infoAgmt) {
            alert('모든 약관에 동의해야 회원가입이 가능합니다.');
            return;
        }
        if (!isIdChecked) {
            alert('아이디 중복 확인을 해주세요.');
            return;
        }
        if (isIdDuplicated) {
            alert('이미 사용중인 아이디입니다.');
            return;
        }
        // passwordConfirm 필드 제거
        delete data.passwordConfirm;
        // addr 주소 저장
        data.addr = address;

        // svcAgmt와 infoAgmt를 data 객체에 추가
        data.svcAgmt = svcAgmt;
        data.infoAgmt = infoAgmt;

        try {
            const response = await api.post('/auth/join', data);
            if (response.data.status === 1000) {
                alert('회원가입이 성공적으로 완료되었습니다. 로그인 화면으로 이동합니다.');
                navigate('/login');
            } else {
                alert('회원가입에 실패했습니다. 잠시후 다시 시도해주세요.');
            }
        } catch (error) {
            alert('회원가입 중 오류가 발생했습니다.');
        }
    };

    const userIdPattern = /^[a-zA-Z0-9]{5,}$/;
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*_-]).+$/;

    return (
        <>
            <ThemeProvider theme={defaultTheme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography component="h1" variant="h5" style={{ fontFamily: 'KBO-Dia-Gothic_medium' }}>
                            회원가입
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                            <Grid container spacing={3}>
                                <Grid container item xs={12} spacing={0.5}>
                                    <Grid item xs={9.5}>
                                        <Controller
                                            name="userId"
                                            control={control}
                                            defaultValue=""
                                            rules={{
                                                required: '아이디는 필수입니다.',
                                                pattern: {
                                                    value: userIdPattern,
                                                    message: '아이디는 영문, 숫자로 5자 이상이어야 합니다.',
                                                },
                                            }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    autoComplete="id"
                                                    required
                                                    fullWidth
                                                    id="userId"
                                                    label="아이디 (영문, 숫자 5자 이상)"
                                                    error={!!errors.userId || isIdDuplicated}
                                                    helperText={errors.userId ? errors.userId.message : isIdDuplicated ? '이미 사용중인 아이디입니다.' : ''}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={2.5}>
                                        <Button sx={{ height: '100%', fontSize: 'smaller', lineHeight: '1.25' }} variant="outlined" color="primary" onClick={checkIdDuplication}>
                                            중복
                                            <br />
                                            확인
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        {...register('password', {
                                            required: '비밀번호는 필수입니다.',
                                            minLength: { value: 8, message: '비밀번호는 8자 이상이어야 합니다.' },
                                            pattern: { value: passwordPattern, message: '비밀번호는 영문, 숫자, 특수기호를 조합해야 합니다.' },
                                        })}
                                        autoComplete="password"
                                        required
                                        fullWidth
                                        id="password"
                                        type="password"
                                        label="비밀번호 (영문+숫자+특수기호 8자 이상)"
                                        error={!!errors.password}
                                        helperText={errors.password ? errors.password.message : ''}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        {...register('passwordConfirm', {
                                            required: '비밀번호 확인은 필수입니다.',
                                            validate: (value) => value === watch('password') || '비밀번호가 일치하지 않습니다.',
                                        })}
                                        autoComplete="password"
                                        required
                                        fullWidth
                                        id="passwordConfirm"
                                        type="password"
                                        label="비밀번호 확인"
                                        error={!!errors.passwordConfirm}
                                        helperText={errors.passwordConfirm ? errors.passwordConfirm.message : ''}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        name="name"
                                        control={control}
                                        defaultValue=""
                                        rules={{ required: '이름은 필수입니다.' }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                autoComplete="name"
                                                required
                                                fullWidth
                                                id="name"
                                                label="이름"
                                                error={!!errors.name}
                                                helperText={errors.name ? errors.name.message : ''}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <ButtonGroup fullWidth variant="contained">
                                        <Button
                                            onClick={() => {
                                                setSelectedGender('M');
                                                setValue('gender', 'M');
                                                clearErrors('gender'); // 오류 상태를 초기화합니다.
                                            }}
                                            variant={selectedGender === 'M' ? 'contained' : 'outlined'}
                                        >
                                            남성
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setSelectedGender('F');
                                                setValue('gender', 'F');
                                                clearErrors('gender'); // 오류 상태를 초기화합니다.
                                            }}
                                            variant={selectedGender === 'F' ? 'contained' : 'outlined'}
                                        >
                                            여성
                                        </Button>
                                    </ButtonGroup>
                                    <Controller
                                        name="gender"
                                        control={control}
                                        defaultValue=""
                                        rules={{
                                            required: '성별 선택은 필수입니다.',
                                        }}
                                        render={({ field }) => (
                                            <>
                                                <input type="hidden" {...field} />
                                                {errors.gender && !selectedGender && <span>{errors.gender.message}</span>}
                                            </>
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        name="birth"
                                        control={control}
                                        defaultValue=""
                                        rules={{
                                            required: '생년월일은 필수입니다.',
                                            pattern: {
                                                value: /^\d{4}-\d{2}-\d{2}$/,
                                                message: '생년월일을 YYYY-MM-DD 형식으로 입력해주세요.',
                                            },
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                autoComplete="birth"
                                                required
                                                fullWidth
                                                id="birth"
                                                label="생년월일 (예시 : 2000-01-01)"
                                                error={!!errors.birth}
                                                helperText={errors.birth ? errors.birth.message : ''}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        {...register('phone', {
                                            required: '전화번호는 필수입니다.',
                                        })}
                                        autoComplete="phone"
                                        required
                                        fullWidth
                                        id="phone"
                                        label="전화번호 (예시 : 01012345678)"
                                        error={!!errors.phone}
                                        helperText={errors.phone ? errors.phone.message : ''}
                                    />
                                </Grid>
                                <Grid container item xs={12} spacing={0.5}>
                                    <Grid item xs={9.5}>
                                        <TextField
                                            sx={{ height: '100%' }}
                                            onChange={(e) => setAddress(e.target.value)}
                                            autoComplete="addr"
                                            required
                                            fullWidth
                                            id="addr"
                                            label="주소"
                                            name="addr"
                                            value={address}
                                        />
                                    </Grid>
                                    <Grid item xs={2.5}>
                                        <Button sx={{ height: '100%' }} variant="outlined" color="primary" onClick={handleClickOpen}>
                                            검색
                                        </Button>
                                        <Dialog open={open} onClose={handleClose}>
                                            <DialogContent>
                                                <DaumPostCode setAddress={setAddress} handleClose={handleClose} />
                                            </DialogContent>
                                        </Dialog>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        name="club"
                                        control={control}
                                        defaultValue={null}
                                        rules={{ required: '선호 구단 선택은 필수입니다.' }}
                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                            <Autocomplete
                                                disablePortal
                                                id="club"
                                                options={selectClub}
                                                fullWidth
                                                autoHighlight
                                                value={selectedClub || null} // value가 undefined인 경우 null로 설정
                                                isOptionEqualToValue={(option, value) => option.value === value.value}
                                                onChange={(event, newValue) => {
                                                    onChange(newValue ? newValue.value : null); // form의 'club' 필드 업데이트
                                                    setSelectedClub(newValue); // 별도의 상태 업데이트
                                                }}
                                                renderOption={(props, option) => (
                                                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                        <img loading="lazy" width="20" src={`https://ssl.gstatic.com/onebox/media/sports/logos/${option.picture}_48x48.png`} alt="" />
                                                        {option.label}
                                                    </Box>
                                                )}
                                                renderInput={(params) => <TextField {...params} label="선호구단" error={!!error} helperText={error ? error.message : null} />}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Box display="flex" justifyContent="flex-end">
                                        <FormControlLabel
                                            control={<Checkbox checked={svcAgmt} onChange={(e) => setSvcAgmt(e.target.checked)} color="primary" />}
                                            label="서비스 이용 약관에 동의합니다. (필수)"
                                        />
                                    </Box>
                                </Grid>
                                <input type="hidden" name="svcAgmt" value={svcAgmt} />
                                <Grid item xs={12}>
                                    <Box display="flex" justifyContent="flex-end">
                                        <FormControlLabel
                                            control={<Checkbox checked={infoAgmt} onChange={(e) => setInfoAgmt(e.target.checked)} color="primary" />}
                                            label="개인정보처리방침에 동의합니다.(필수)"
                                        />
                                    </Box>
                                </Grid>
                                <input type="hidden" name="infoAgmt" value={infoAgmt} />
                                <Grid item xs={12}>
                                    <Box display="flex" justifyContent="flex-end">
                                        <Button variant="outlined" color="primary" onClick={handleAllAgree}>
                                            전체 동의
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                    가입하기
                                </Button>
                            </Grid>
                            <Grid container justifyContent="flex-end"></Grid>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </>
    );
}
