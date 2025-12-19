export interface CollectionFormData {
    firstName: string;
    lastName: string;
    zipcode: string;
    helpType: string;
    contactMethod: 'email' | 'phone' | '';
    email: string;
    phone: string;
    countryCode: string;
    videoUrl: string;
    videoUrlPath: string;
    fileSubmissionId: string;
    videoUploading: boolean;
}

export interface HelpOption {
    id: 'labour' | 'storage' | 'both';
    label: string;
    icon: any;
    desc: string;
}

export interface ContactOption {
    id: 'email' | 'phone';
    label: string;
    icon: any;
    desc: string;
}

export interface StepConfig {
    number: number;
    title: string;
    desc: string;
}
