import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types for the form data sections
export interface PersonalInfo {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  mobile: string;
  whatsapp?: string;
  address: string;
  city: string;
  country: string;
}

export interface Subject {
  name: string;
  fullMarks: number;
  obtainedMarks: number;
}

export interface AcademicInfo {
  class10Year: string;
  class10Subjects: Subject[];
  class12Year: string;
  class12Subjects: Subject[];
}

export interface NeetInfo {
  neetYear: string;
  neetScore: number;
}

export interface DocumentFiles {
  passportPhoto: File | null;
  authorizedSignature: File | null;
  candidateSignature: File | null;
}

export interface ApplicationData {
  personal: PersonalInfo;
  academic: AcademicInfo;
  neet: NeetInfo;
  documents: DocumentFiles;
}

interface FormDataContextProps {
  data: Partial<ApplicationData>;
  setData: (newData: Partial<ApplicationData>) => void;
}

const FormDataContext = createContext<FormDataContextProps | undefined>(undefined);

export const useFormData = (): FormDataContextProps => {
  const ctx = useContext(FormDataContext);
  if (!ctx) throw new Error('useFormData must be used within FormDataProvider');
  return ctx;
};

interface ProviderProps {
  children: ReactNode;
}

export const FormDataProvider: React.FC<ProviderProps> = ({ children }) => {
  const [data, setData] = useState<Partial<ApplicationData>>({});
  const update = (newData: Partial<ApplicationData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };
  return (
    <FormDataContext.Provider value={{ data, setData: update }}>
      {children}
    </FormDataContext.Provider>
  );
};
