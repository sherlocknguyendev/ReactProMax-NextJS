
'use client'

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const NProgressBarWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            {children}
            <ProgressBar
                height="2px"
                color='rgb(10, 104, 255)'
                options={{ showSpinner: false }}
                shallowRouting
            />
        </>
    );
};

export default NProgressBarWrapper;