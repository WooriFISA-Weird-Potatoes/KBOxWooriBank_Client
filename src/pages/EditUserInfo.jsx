import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import DaumPostCode from '../components/DaumPostcode';
import { Button, CssBaseline, TextField, ButtonGroup, Autocomplete, Grid, Box, Typography, Container, Dialog, DialogContent } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Loading from '../components/Loading';
import BackButton from '../components/BackButton';
import useFetch from '../hooks/useFetch';

const defaultTheme = createTheme({
    typography: {
        fontFamily: 'KBO-Dia-Gothic_light',
    },
});

export default function EditUserInfo() {
    const { user, setUser } = useUser();
    const { data: userInfo, isLoading, refetch } = useFetch('/users');
    const [selectedGender, setSelectedGender] = useState(null);
    const [selectedClub, setSelectedClub] = useState(null);
    const [address, setAddress] = useState('');
    const [open, setOpen] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
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

    useEffect(() => {
        if (userInfo) {
            setSelectedGender(userInfo.gender);
            setSelectedClub(selectClub.find((item) => item.value === userInfo.club));
            setAddress(userInfo.addr);

            setValue('userId', userInfo.userId);
            setValue('name', userInfo.name);
            setValue('gender', userInfo.gender);
            setValue('birth', userInfo.birth);
            setValue('phone', userInfo.phone);
            setValue('club', userInfo.club);
        }
    }, [userInfo]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        watch,
    } = useForm({
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            phone: '',
        },
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onSubmit = async (data) => {
        delete data.passwordConfirm;
        data.addr = address;

        try {
            await refetch('/users', null, 'PUT', data);
            alert('수정되었습니다.');
            navigate('/mypage');
        } catch (error) {
            alert('잠시후 다시 시도해주세요.');
        }
    };

    const handleDelete = () => {
        setIsOpenModal(true);
    };

    const closeModal = () => {
        setIsOpenModal(false);
    };

    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*_-]).+$/;

    return (
        <>
            <ThemeProvider theme={defaultTheme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <BackButton />
                        <Typography component="h1" variant="h5" sx={{ margin: 'auto', fontFamily: 'KBO-Dia-Gothic_medium' }}>
                            회원정보수정
                        </Typography>
                        <div style={{ minWidth: '28px' }}></div>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        {isLoading ? (
                            <Loading />
                        ) : (
                            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                                <Grid container spacing={3}>
                                    <Grid container item xs={12} spacing={0.5}>
                                        <Grid item xs={12}>
                                            <Controller
                                                name="userId"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField InputLabelProps={{ shrink: true }} {...field} disabled fullWidth id="userId" label="아이디" value={userInfo ? userInfo.userId : ''} />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            {...register('password', {
                                                required: '비밀번호는 필수입니다.',
                                                minLength: { value: 8, message: '비밀번호는 8자 이상이어야 합니다.' },
                                                pattern: { value: passwordPattern, message: '비밀번호는 영문, 숫자, 특수기호를 조합해야 합니다.' },
                                            })}
                                            autoComplete="off"
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
                                            required
                                            fullWidth
                                            autoComplete="off"
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
                                            render={({ field }) => <TextField {...field} autoComplete="name" required fullWidth id="name" label="이름" value={field.value} />}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ButtonGroup fullWidth variant="contained">
                                            <Button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                }}
                                                variant={selectedGender === 'M' ? 'contained' : 'outlined'}
                                            >
                                                남성
                                            </Button>
                                            <Button
                                                onClick={(e) => {
                                                    e.preventDefault();
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
                                            render={({ field }) => (
                                                <>
                                                    <input type="hidden" {...field} />
                                                </>
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Controller
                                            name="birth"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    InputLabelProps={{ shrink: true }}
                                                    {...field}
                                                    disabled
                                                    autoComplete="birth"
                                                    fullWidth
                                                    id="birth"
                                                    value={userInfo ? userInfo.birth : ''}
                                                    label="생년월일"
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Controller
                                            name="phone"
                                            control={control}
                                            rules={{ required: '전화번호는 필수입니다.' }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    autoComplete="phone"
                                                    required
                                                    fullWidth
                                                    id="phone"
                                                    label="전화번호 (예시 : 01012345678)"
                                                    value={field.value} // 초기값이 여기에 설정됩니다.
                                                    error={!!errors.phone}
                                                    helperText={errors.phone ? errors.phone.message : ''}
                                                />
                                            )}
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
                                </Grid>
                                <Grid item xs={12}>
                                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                        수정하기
                                    </Button>
                                    <Button fullWidth onClick={handleDelete} variant="text" sx={{ mb: 4, fontFamily: 'KBO-Dia-Gothic_medium', justifyContent: 'flex-end' }}>
                                        탈퇴하기
                                    </Button>
                                    <Dialog
                                        open={isOpenModal}
                                        onClose={closeModal}
                                        fullWidth={true}
                                        maxWidth="sm"
                                        PaperProps={{
                                            style: {
                                                borderTopLeftRadius: 20,
                                                borderTopRightRadius: 20,
                                                bottom: 0,
                                                position: 'absolute',
                                                margin: 0,
                                                paddingBottom: '3em',
                                                paddingTop: '1em',
                                                width: '100%',
                                            },
                                        }}
                                    >
                                        <DialogContent>
                                            <Typography variant="h5" sx={{ marginBottom: '1em', fontWeight: 'bold' }}>
                                                정말로 탈퇴하시겠습니까?
                                            </Typography>
                                            <Typography>
                                                회원 탈퇴 시 계정 정보 및 보유중인 <br />
                                                포인트는 삭제되어 복구가 불가합니다.
                                            </Typography>
                                            <Container sx={{ display: 'flex', marginTop: '2em', flexDirection: 'column' }}>
                                                <Button
                                                    onClick={async () => {
                                                        // 탈퇴 로직을 여기에 작성
                                                        await refetch('/users', null, 'DELETE');
                                                        localStorage.clear();
                                                        sessionStorage.clear();
                                                        setUser(null);
                                                        closeModal();
                                                        navigate('/');
                                                    }}
                                                    variant="outlined"
                                                    sx={{ marginBottom: '1.5em' }}
                                                >
                                                    탈퇴하기
                                                </Button>
                                                <Button onClick={closeModal} variant="contained">
                                                    취 소
                                                </Button>
                                            </Container>
                                        </DialogContent>
                                    </Dialog>
                                </Grid>
                                <Grid container justifyContent="flex-end"></Grid>
                            </Box>
                        )}
                    </Box>
                </Container>
            </ThemeProvider>
        </>
    );
}
