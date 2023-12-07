
import { useState, useEffect } from 'react';


// Hàm này để đảm bảo rằng code của chúng tả chỉ chạy ở phía client thôi 
// (bỏ qua phần pre-render của server component -> đẩy lên cho client component để render)
export const useHasMounted = () => {
    const [hasMounted, setHasMounted] = useState<boolean>(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);

    return hasMounted;
}

