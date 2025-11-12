interface SubjectChartData  {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        borderColor?: string;
        backgroundColor?: string;
        [key: string]: any;
    }[];
}