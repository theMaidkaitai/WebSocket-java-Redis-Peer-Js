package org.kaitai.voice.repository;

import org.kaitai.voice.models.RoomEntity;
import org.kaitai.voice.services.room.dto.RoomDto;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface RoomRepository extends CrudRepository<RoomEntity, String> {
}