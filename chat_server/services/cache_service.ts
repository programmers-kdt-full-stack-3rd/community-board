// TODO: DTO 정의 필요

// 캐시 조회
const getCachedData = async (param: any): Promise<string | null> => {
	try {
		// TODO: 캐시 조회
		return null;
	} catch (error) {
		// TODO: error 처리 & cache miss
		return null;
	}
};

// 캐시 저장
const setCachedData = async (param: any): Promise<void> => {
	try {
		// TODO: 캐시 저장
	} catch (error) {
		console.error(`Error setting data in cache: ${error}`);
	}
};

// 캐시 삭제
const deleteCachedData = async (param: any): Promise<void> => {
	try {
		// TODO: 캐시 삭제
	} catch (error) {
		console.error(`Error deleting data from cache: ${error}`);
	}
};

export { getCachedData, setCachedData, deleteCachedData };
