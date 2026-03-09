import {useLoadingStore} from "@/stores/loading-store.ts";


export function loadingBlock() {
    const loadingStore = useLoadingStore();
    loadingStore.show()
}

export function loadingUnBlock() {
    const loadingStore = useLoadingStore();
    loadingStore.hide()
}