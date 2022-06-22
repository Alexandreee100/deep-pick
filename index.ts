type NonNullableSkipArrays<T> = NonNullable<T> extends infer S ? (S extends unknown[] ? NonNullable<S[number]> : S) : never;

type Tail<Path extends unknown[]> = ((...args: Path) => unknown) extends (_: any, ...rest: infer Rest) => unknown ? Rest : never;

type InvalidatePath<Source, Path extends (string | number)[]> = Source extends object
    ? DeepPick<Source, Path> extends infer T
        ? T extends never
            ? never
            : T
        : never
    : never;

type InvalidatePathSkipArrays<Source, Path extends (string | number)[]> = Source extends object
    ? DeepPickSkipArrays<Source, Path> extends infer T
        ? T extends never
            ? never
            : T
        : never
    : never;

type CreateStructure<Source extends object,
    Path extends (string | number)[],
    Keys extends unknown,
    Mode extends 'pick' | 'omit',
    > = Path extends [keyof Source, ...unknown[]]
    ? {
        [P in Path[0]]: DeepExtractStructure<Source[Path[0]], Tail<Path>, Keys, Mode>;
    }
    : [Keys] extends [keyof Source]
        ? Mode extends 'pick'
            ? Pick<Source, Keys>
            : Omit<Source, Keys>
        : Source;

type CreateStructureSkipArrays<Source extends object,
    Path extends (string | number)[],
    Keys extends unknown,
    Mode extends 'pick' | 'omit',
    > = Path extends [keyof Source, ...unknown[]]
    ? {
        [P in Path[0]]: DeepExtractStructureSkipArrays<Source[Path[0]], Tail<Path>, Keys, Mode>;
    }
    : [Keys] extends [keyof Source]
        ? Mode extends 'pick'
            ? Pick<Source, Keys>
            : Omit<Source, Keys>
        : Source;

type DeepExtractStructure<Source,
    Path extends (string | number)[],
    Keys extends unknown,
    Mode extends 'pick' | 'omit',
    > = InvalidatePath<Source, Path> extends never ? never : Source extends object ? CreateStructure<Source, Path, Keys, Mode> : Source;

type DeepExtractStructureSkipArrays<Source,
    Path extends (string | number)[],
    Keys extends unknown,
    Mode extends 'pick' | 'omit',
    > = InvalidatePathSkipArrays<Source, Path> extends never
    ? never
    : NonNullableSkipArrays<Source> extends object
        ? CreateStructureSkipArrays<NonNullableSkipArrays<Source>, Path, Keys, Mode>
        : Source;

type DeepPick<Source extends object, Path extends (string | number)[]> = Path extends [keyof Source, ...unknown[]]
    ? NonNullable<Source[Path[0]]> extends infer NestedValue
        ? NestedValue extends object
            ? DeepPick<NestedValue, Tail<Path>>
            : NestedValue
        : never
    : [] extends Path
        ? Source
        : never;

type DeepPickSkipArrays<Source extends object, Path extends (string | number)[]> = Path extends [keyof Source, ...unknown[]]
    ? NonNullableSkipArrays<Source[Path[0]]> extends infer NestedValue
        ? NestedValue extends object
            ? DeepPickSkipArrays<NestedValue, Tail<Path>>
            : NestedValue
        : never
    : [] extends Path
        ? Source
        : never;

type DeepPickKeys<Source extends object, Path extends (string | number)[]> = keyof DeepPick<Source, Path>;

type DeepPickKeysSkipArrays<Source extends object, Path extends (string | number)[]> = keyof DeepPickSkipArrays<Source, Path>;

export type DeepExtract<Source extends object,
    Path extends (string | number)[],
    Keys extends DeepPickKeys<Source, Path> = DeepPickKeys<Source, Path>,
    Mode extends 'pick' | 'omit' = 'pick',
    > = DeepExtractStructure<Source, Path, Keys, Mode>;

export type DeepExtractSkipArrays<Source extends object,
    Path extends (string | number)[],
    Keys extends DeepPickKeysSkipArrays<Source, Path> = DeepPickKeysSkipArrays<Source, Path>,
    Mode extends 'pick' | 'omit' = 'pick',
    > = DeepExtractStructureSkipArrays<Source, Path, Keys, Mode>;