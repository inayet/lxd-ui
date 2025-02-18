import { LxdStorageVolume } from "types/storage";

interface LxdImageAlias {
  name: string;
  description: string;
}

export interface LxdImage {
  fingerprint: string;
  public: boolean;
  properties: {
    description: string;
    os: string;
    release: string;
    variant?: string;
  };
  update_source?: {
    alias: string;
    protocol: string;
    server: string;
  };
  architecture: string;
  type: string;
  size: number;
  uploaded_at: string;
  aliases: LxdImageAlias[];
}

export interface ImportImage {
  aliases: string;
  server: string;
}

export interface RemoteImage {
  aliases: string;
  arch: string;
  created_at: number;
  lxd_requirements?: {
    secureboot: boolean;
  };
  os: string;
  pool?: string;
  release: string;
  release_title?: string;
  variant?: string;
  versions?: Record<
    string,
    {
      items: Record<
        string,
        {
          ftype: string;
        }
      >;
    }
  >;
  server?: string;
  volume?: LxdStorageVolume;
}

export interface RemoteImageList {
  products: {
    key: RemoteImage;
  };
}
