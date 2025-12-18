import { Language } from '../types';

export type RegionKey = 'Global' | 'East Asia' | 'Europe' | 'Americas' | 'Middle East' | 'South Asia' | 'Southeast Asia' | 'Oceania' | 'Africa';

export const REGION_MAP: Record<RegionKey, Language[]> = {
    'Global': [
        Language.English,
        Language.Chinese,
        Language.Spanish,
        Language.French,
        Language.German,
        Language.Japanese,
        Language.Arabic,
        Language.Russian,
        Language.Portuguese,
        Language.Hindi,
        Language.Bengali,
        Language.Urdu,
        Language.Indonesian
    ],
    'East Asia': [
        Language.Chinese,
        Language.TraditionalChinese,
        Language.Japanese,
        Language.Korean,
        Language.Vietnamese,
        Language.Mongolian
    ],
    'Europe': [
        Language.English,
        Language.French,
        Language.German,
        Language.Spanish,
        Language.Italian,
        Language.Russian,
        Language.Portuguese,
        Language.Dutch,
        Language.Polish,
        Language.Greek,
        Language.Czech,
        Language.Swedish,
        Language.Norwegian,
        Language.Danish,
        Language.Finnish,
        Language.Hungarian,
        Language.Romanian
    ],
    'Americas': [
        Language.English,
        Language.Spanish,
        Language.Portuguese,
        Language.French,
        Language.Dutch
    ],
    'Middle East': [
        Language.Arabic,
        Language.Turkish,
        Language.English,
        Language.Farsi,
        Language.Hebrew,
        Language.Kurdish
    ],
    'South Asia': [
        Language.Hindi,
        Language.Bengali,
        Language.Urdu,
        Language.English,
        Language.Tamil,
        Language.Telugu,
        Language.Marathi,
        Language.Gujarati,
        Language.Punjabi,
        Language.Nepali,
        Language.Sinhala
    ],
    'Southeast Asia': [
        Language.Indonesian,
        Language.Malay,
        Language.Thai,
        Language.Vietnamese,
        Language.English,
        Language.Filipino,
        Language.Burmese,
        Language.Khmer,
        Language.Lao
    ],
    'Oceania': [
        Language.English,
        Language.Indonesian,
        Language.Maori,
        Language.Hawaiian,
        Language.French
    ],
    'Africa': [
        Language.English,
        Language.Arabic,
        Language.French,
        Language.Portuguese,
        Language.Swahili,
        Language.Hausa,
        Language.Amharic,
        Language.Yoruba,
        Language.Zulu,
        Language.Afrikaans
    ]
};

export const REGION_LABELS: Record<RegionKey, string> = {
    'Global': 'Global',
    'East Asia': 'East Asia',
    'Europe': 'Europe',
    'Americas': 'Americas',
    'Middle East': 'Middle East',
    'South Asia': 'South Asia',
    'Southeast Asia': 'Southeast Asia',
    'Oceania': 'Oceania',
    'Africa': 'Africa'
};

export const DEFAULT_REGION: RegionKey = 'Global';