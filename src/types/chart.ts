interface SubjectChartData  {
    labels: string[];
    datasets: {
        label: string;
        data: (number | null)[];
        borderColor?: string;
        backgroundColor?: string;
        [key: string]: any;
    }[];
}