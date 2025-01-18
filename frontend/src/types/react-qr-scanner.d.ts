declare module 'react-qr-scanner' {
    import { Component } from 'react';
  
    export interface QrScannerProps {
      delay?: number | false;
      style?: React.CSSProperties;
      className?: string;
      onError?: (err: any) => void;
      onScan?: (data: string | null) => void;
      onLoad?: () => void;
      facingMode?: 'user' | 'environment';
      legacyMode?: boolean;
      constraints?: MediaTrackConstraints;
      chooseDeviceId?: () => string | Promise<string>;
      showViewFinder?: boolean;
    }
  
    export default class QrScanner extends Component<QrScannerProps> {}
  }