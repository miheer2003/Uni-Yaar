package com.uniyar.repository;

import com.uniyar.entity.Room;
import com.uniyar.entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByFloorIdOrderByRoomNumberAsc(Long floorId);
    List<Room> findByFloorBuildingId(Long buildingId);
    List<Room> findByRoomType(RoomType roomType);
    List<Room> findByNameContainingIgnoreCaseOrRoomNumberContainingIgnoreCase(String name, String roomNumber);
}
